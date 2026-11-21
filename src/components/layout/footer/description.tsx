import { content } from './constants';

// ------------------------------

export default function Description() {
  const { description } = content;

  return (
    <p className="text-muted-foreground text-justify text-sm leading-7 font-medium">
      {description}
    </p>
  );
}
