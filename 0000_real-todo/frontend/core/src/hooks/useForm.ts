import { useCallback, useState } from "react";

export class Errors<T> extends Map<keyof T, string> {
  get object() {
    return Array.from(this.keys()).reduce(
      (acc: { [key: string]: string }, key: keyof T) => {
        if (this.get(key)) {
          return {
            ...acc,
            [key]: this.get(key) || "",
          };
        }

        return acc;
      },
      {},
    );
  }

  merge(values: { [key: string]: string }) {
    const newErrors = {
      ...this.object,
      ...values,
    };
    const entries = Object.entries(newErrors);

    const errors = new Errors<T>();
    entries.forEach((entry) => {
      const [key, value] = entry;
      if (value) {
        errors.set(key as keyof T, value as string);
      }
    });

    return errors;
  }
}

type validateOptions<T> = {
  errors: Errors<T> | undefined;
  setErrors: (errors: Errors<T>) => void;
};

interface Props<T> {
  initialValues: T;
  validate: (
    values: T,
    { errors }: { errors: Errors<T> },
  ) => Errors<T>;
  onSubmit: (values: T, options: validateOptions<T>) => void;
}

export const useForm = <T>({ initialValues, validate, onSubmit }: Props<T>) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState<Errors<typeof initialValues>>(
    new Errors(),
  );
  const handleSubmit = useCallback(() => {
    const errors = new Errors<T>()
    const result = validate(form, {
      errors,
    });

    setErrors(result)
    const isValid = result.size === 0;
    if (!isValid) {
      return;
    }

    onSubmit(form, { errors: result, setErrors });
  }, [form, onSubmit, validate, setErrors]);

  const change = useCallback(
    (values: Partial<T>) => setForm({ ...form, ...values }),
    [form, setForm],
  );

  return {
    form,
    errors,
    change,
    setForm,
    submit: handleSubmit,
  };
};
