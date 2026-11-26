'use client';

import { z } from 'zod';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { setAuthCookies } from '@/utils/authCookies';
import { useForm } from 'react-hook-form';

import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { convertToEnglishDigits } from '@/utils';
import { generalInstance } from '@/utils/services';
import RulesAndRegulation from './RulesAndRegulation';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';

const formSchema = z.object({
  phoneNumber: z
    .string()
    .regex(
      /^9\d{9}$/,
      'شماره همراه باید ۱۰ رقم باشد و با ۹ شروع شود (مثال: ۹۱۲۳۴۵۶۷۸۹)',
    ),
});

type Props = {
  setDialogStep: () => void;
};

// ----------------------------

export default function PhoneNumber(props: Props) {
  const { setDialogStep } = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { phoneNumber: '' },
  });

  useEffect(() => {
    const storedPhoneNumber = sessionStorage.getItem('upn');
    if (storedPhoneNumber) {
      form.setValue('phoneNumber', storedPhoneNumber);
    }
  }, [form]);

  const mutation = useMutation({
    mutationFn: (data: { phone: string }) => {
      return generalInstance.post('/auth/', data);
    },
    onError: (error: AxiosError<any>) => {
      const status = error?.response?.status;
      if (status === 502 || status === 504) {
        form.setError('phoneNumber', {
          message:
            'سرور بک‌اند در دسترس نیست (502 Bad Gateway). لطفاً سرویس Django/Gunicorn را در سرور بررسی فرمایید.',
        });
        return;
      }

      const data = error?.response?.data;
      const serverError =
        data?.detail ||
        data?.message ||
        data?.error ||
        (Array.isArray(data?.phone) ? data.phone[0] : undefined) ||
        (Array.isArray(data?.non_field_errors)
          ? data.non_field_errors[0]
          : undefined);

      if (
        typeof serverError === 'string' &&
        (serverError.includes('قبلاً') || serverError.includes('وارد شده‌اید'))
      ) {
        setAuthCookies();
        window.location.reload();
        return;
      }

      form.setError('phoneNumber', {
        message:
          typeof serverError === 'string' && serverError.trim()
            ? serverError
            : status === 403
              ? 'درخواست ارسال پیامک توسط فایروال یا سرور مسدود شد (403).'
              : 'مشکلی در ارسال پیامک به وجود آمده است، لطفاً مجدداً تلاش نمایید.',
      });
    },
    onSuccess: () => {
      setDialogStep();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let clean = values.phoneNumber.replace(/[^\d]/g, '');
    if (clean.startsWith('0')) clean = clean.slice(1);
    sessionStorage.setItem('upn', clean);
    mutation.mutate({ phone: `0${clean}` });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col md:items-center"
      >
        <span className="mb-2.5 text-cs09 font-extrabold text-zinc-800">
          ورود به حساب کاربری
        </span>

        <p className="text-cs08 font-semibold text-zinc-600">
          برای ورود به زروان تریپ شماره همراه خود را وارد نمایید :
        </p>

        <div
          dir="ltr"
          className={`mb-4 mt-6 grid h-12 w-full grid-cols-[1fr_3fr] overflow-hidden rounded-lg border-2 text-zinc-600 md:mb-3 md:mt-5 ${form.formState.errors.phoneNumber ? 'border-cs-red/50' : 'border-zinc-200'}`}
        >
          <div className="flex-center border-r-2 text-[0.85rem] font-semibold text-zinc-400">
            + 98
          </div>

          <FormField
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="9123456789"
                    type="tel"
                    inputMode="numeric"
                    onChange={(e) => {
                      let cleaned = convertToEnglishDigits(
                        e.target.value,
                      ).replace(/[^\d]/g, '');
                      if (cleaned.startsWith('98') && cleaned.length > 2) {
                        cleaned = cleaned.slice(2);
                      }
                      if (cleaned.startsWith('0')) {
                        cleaned = cleaned.slice(1);
                      }
                      field.onChange(cleaned.slice(0, 10));
                    }}
                    className="h-full rounded-none border-none pl-6 text-[0.9rem] tracking-[0.2rem]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <p className="mb-3 text-cs08 font-semibold text-red-500 md:mb-0">
          {form.formState.errors.phoneNumber?.message}
        </p>

        <RulesAndRegulation />

        <button
          disabled={mutation.isPending}
          className={`relative mt-auto h-12 w-full overflow-hidden rounded-lg bg-cs-dark-blue transition-colors duration-300 ease-in-out hover:bg-cs-dark-blue/95 md:mt-0 ${mutation.isPending ? 'cursor-not-allowed hover:bg-cs-dark-blue' : ''}`}
        >
          <span
            className={`flex-center pointer-events-none absolute inset-0 text-cs85 font-semibold text-zinc-100 transition-all duration-300 ease-in-out ${mutation.isPending ? 'invisible -right-8 opacity-0' : 'visible right-0 opacity-100'}`}
          >
            تایید و دریافت کد
          </span>

          <span
            className={`flex-center pointer-events-none absolute inset-0 transition-all duration-300 ease-in-out ${mutation.isPending ? 'visible left-0 opacity-100' : 'invisible -left-8 opacity-0'}`}
          >
            <span className="loader-dots" />
          </span>
        </button>
      </form>
    </Form>
  );
}
