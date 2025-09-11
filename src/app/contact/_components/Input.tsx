'use client'

import { FieldError, Path } from "react-hook-form";
import React from "react";
import classes from "../../_styles/Input.module.css"
import { ContactForm } from "../page";

export type InputProps = {
  id: Path<ContactForm>
  label: string
  type: string
  disabled?: boolean
  error?: FieldError
  placeholder? : string 
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { id, label, type, disabled, error, placeholder, ...inputProps } = props

  return(
    <div className={classes.formContainer}>
      <label htmlFor={id} className={classes.label}>{label}</label>
      <div className={classes.inputContainer}>
        <input 
          id={id} 
          type={type}
          disabled={disabled} 
          className={classes.input} 
          placeholder={placeholder}
          ref={ref}
          {...inputProps}
        />
        {error && <div className={classes.errorMessage}>{error.message}</div>}
      </div>
    </div>
  );
})