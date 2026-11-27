// Forcing next.js to render this component as client side component
"use client";

// Importing part
import { ICX } from '@/components/icons/ICX';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useApiMutation from '@/hooks/dashboard/useApiMutation';
import { RenewSubscriptionDialogProps } from '@/types/dashboard/component';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneNumberValidator, verifyIranianNationalId } from '@persian-tools/persian-tools';
import { useQueryClient } from '@tanstack/react-query';
import { JSX, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from '../../ui/customSonner/toast';
import NormalInput from '../../profile/normalInput';
import Loading from '../../ui/loading';
import useUserInfo from '@/hooks/dashboard/useUserInfo';

// Defining form schema
const formSchema = z.object({
  name: z
    .string({
      required_error: "وارد کردن نام الزامی است."
    })
    .min(2, { message: "نام باید حداقل ۲ کاراکتر باشد." })
    .max(256, { message: "نام نمی‌تواند بیشتر از ۲۵۶ کاراکتر باشد." }),
  phoneNumber: z
    .string({
      required_error: "وارد کردن شماره موبایل الزامی است."
    })
    .refine(val => phoneNumberValidator(val), {
      message: "شماره موبایل معتبر نیست.",
    }),
  nationalCode: z
    .string({
      required_error: "وارد کردن کد ملی الزامی است."
    })
    .refine(val => verifyIranianNationalId(val), {
      message: "کد ملی معتبر نیست.",
    }),
  file: z
    .custom<File>((v) => v instanceof File, { message: "آپلود تصویر فیش الزامی است." })
    .refine((file) => file.size <= 30 * 1024 * 1024, {
      message: "حجم فایل باید کمتر از ۳۰ مگابایت باشد.",
    })
    .refine((file) => /^image\//.test(file.type), {
      message: "فایل باید یک تصویر باشد (png, jpg, webp, ...).",
    })

});

// Defining form Type
type formType = z.infer<typeof formSchema>;

function extractErrorMessage(err: unknown): string {
  const resData = (err as { response?: { data?: unknown } } | undefined)
    ?.response?.data;
  if (!resData) {
    return "در هنگام تمدید اشتراک شما مشکلی پیش آمد.";
  }
  if (typeof resData === "string") {
    return resData;
  }
  if (typeof resData === "object") {
    const record = resData as Record<string, unknown>;
    const direct = record.detail || record.error || record.message;
    if (typeof direct === "string" && direct.trim()) {
      return direct;
    }
    for (const val of Object.values(record)) {
      if (typeof val === "string" && val.trim()) {
        return val;
      }
      if (Array.isArray(val) && typeof val[0] === "string") {
        return val[0];
      }
    }
  }
  return "در هنگام تمدید اشتراک شما مشکلی پیش آمد.";
}

// Creating and exporting RenewSubscriptionDialog component as default
export default function RenewSubscriptionDialog({
  open, onOpenChange,
}: RenewSubscriptionDialogProps): JSX.Element {
  // Defining hooks
  const queryClient = useQueryClient();
  const userInfo = useUserInfo();
  const defaultName = `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim();
  const defaultPhone = userInfo.phone_number || '';
  const defaultNationalCode = userInfo.national_code || '';

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultName,
      phoneNumber: defaultPhone,
      nationalCode: defaultNationalCode,
    },
  });

  useEffect(() => {
    form.reset({
      name: defaultName,
      phoneNumber: defaultPhone,
      nationalCode: defaultNationalCode,
      file: undefined,
    });
  }, [open, defaultName, defaultPhone, defaultNationalCode, form]);

  const setData = useApiMutation({
    url: "/subscription/renewal-request/",
    method: "post",
    isFormData: true,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["current-subscription"] });
        queryClient.invalidateQueries({ queryKey: ["subscription-chart"] });
        toast({
          title: "درخواست تمدید اشتراک ثبت شد!",
          description: "پس از بررسی و تایید فیش واریزی، اشتراک شما تمدید خواهد شد.",
          theme: "green"
        });
        onOpenChange?.(false);
      },
      onError: (err) => {
        toast({
          title: "خطایی رخ داد!",
          description: extractErrorMessage(err),
          theme: "theme"
        });
      },
    }
  });

  // Defining onSubmit event
  const onSubmit: SubmitHandler<formType> = async (submitData) => {
    try {
      await setData.mutateAsync({
        full_name: submitData.name,
        phone_number: submitData.phoneNumber,
        national_id: submitData.nationalCode,
        receipt: submitData.file,
      });
    } catch {
      // Error toast is handled by mutation onError
    }
  };

   // Defining variables
   const formWatch = form.watch();

  // Returning JSX
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full lg:max-w-[450px] max-w-full gap-0 p-0 lg:rounded-xl rounded-none">
        <DialogHeader className='flex !flex-row items-center justify-between gap-3 border-b border-b-black/10 w-full px-4 h-[50px]'>
          <DialogTitle className="text-right lg:text-[14px] text-[12px] font-bold text-black truncate flex-1">
             تمدید کارت اشتراک
          </DialogTitle>
          <DialogClose className='shrink-0 !mt-0' asChild>
            <button type="button" aria-label="بستن">
              <ICX className='size-3' />
            </button>
          </DialogClose>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='p-4 space-y-4 lg:max-h-[calc(100dvh-50px-25px)] max-h-[calc(100dvh-50px)] overflow-auto scrollbar-hide'>
          <div className='w-full'>
            <span className="font-semibold text-cs85 text-black truncate text-right mb-2 block">
              نام و نام خانوادگی
            </span>
            <NormalInput
              type="text"
              className="h-[45px] w-full"
              placeholder="نام و نام خانوادگی خود را وارد کنید"
              error={form.formState.errors.name?.message}
              value={formWatch.name || ''}
              onChange={(e) => {
                form.setValue("name", e.currentTarget.value, {
                  shouldValidate: true,
                });
              }}
            />
          </div>
          <div className='w-full'>
            <span className="font-semibold text-cs85 text-black truncate text-right mb-2 block">
              شماره همراه
            </span>
            <NormalInput
              type="tel"
              className="h-[45px] w-full"
              placeholder="شماره همراه خود را وارد کنید"
              error={form.formState.errors.phoneNumber?.message}
              lenghtValidation={11}
              value={formWatch.phoneNumber || ''}
              onChange={(e) => {
                form.setValue("phoneNumber", e.currentTarget.value, {
                  shouldValidate: true,
                });
              }}
            />
          </div>
          <div className='w-full'>
            <span className="font-semibold text-cs85 text-black truncate text-right mb-2 block">
              کد ملی
            </span>
            <NormalInput
              type="text"
              className="h-[45px] w-full"
              placeholder="کد ملی خود را وارد کنید"
              error={form.formState.errors.nationalCode?.message}
              lenghtValidation={10}
              value={formWatch.nationalCode || ''}
              onChange={(e) => {
                form.setValue("nationalCode", e.currentTarget.value, {
                  shouldValidate: true,
                });
              }}
            />
          </div>
          <div className='w-full'>
            <span className="font-semibold text-cs85 text-black truncate text-right mb-2 block">
              آپلود عکس فیش
            </span>
            <NormalInput
              key={open ? 'renew-file-open' : 'renew-file-closed'}
              type="file"
              className="h-[45px] w-full"
              placeholder="برای بارگذاری فایل مورد نظر کلیک کنید"
              accept="image/*"
              error={form.formState.errors.file?.message}
              onChange={(e) => {
                const files = e.currentTarget.files;
                if (files && files[0]) {
                  form.setValue("file", files[0], {
                    shouldValidate: true
                  });
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={form.formState.isSubmitting || setData.isPending}
            className="h-[45px] rounded-md flex items-center justify-center bg-[#252525] text-white w-full disabled:text-[#252525] disabled:bg-[#e7e7e7] disabled:cursor-not-allowed transition-all duration-500 text-cs08 font-semibold px-4"
          >
            {
              !(form.formState.isSubmitting || setData.isPending)
                ? "ثبت اطلاعات"
                : <Loading className='bg-current' />
            }
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
