import React from 'react';
import { RegisterOptions, useFormContext, UseFormGetValues } from 'react-hook-form';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { InputType } from 'reactstrap/es/Input';

type ValidateFunction = (value: any, getValue: UseFormGetValues<any>) => true | string;
interface FieldProps {
  name: string;
  id: string;
  label: string;
  defaultValues?: any;
  type?: InputType;
  registerOptions?: RegisterOptions;
  validate?: ValidateFunction;
  className?: string;
  checked?: boolean;
  onChange?: any;
  style?: React.CSSProperties;
}
export const CustomValidatedField = ({
  label,
  id,
  name,
  type,
  registerOptions,
  validate,
  className,
  checked,
  onChange,
  style,
}: FieldProps) => {
  const { register, getValues, formState } = useFormContext();
  const error = formState.errors[name];
  const touched = formState.touchedFields[name];

  const options = registerOptions || {};
  if (validate) {
    options.validate = value => validate(value, getValues);
  }

  const { ref, ...attributes } = register(name, options);

  return (
    <FormGroup className={className} check={type === 'checkbox'}>
      {label && (
        <Label style={{ marginRight: type === 'checkbox' ? '2rem' : '', ...style }} id={name + 'Label'} check={type === 'checkbox'}>
          {label}
        </Label>
      )}

      <Input
        min={0}
        type={type}
        id={id}
        innerRef={ref}
        {...attributes}
        onChange={onChange}
        valid={!error && touched}
        invalid={Boolean(error)}
        data-cy={name}
        checked={checked}
        style={{ position: 'relative' }}
      />
      {error && <FormFeedback>{error.message || error}</FormFeedback>}
    </FormGroup>
  );
};
