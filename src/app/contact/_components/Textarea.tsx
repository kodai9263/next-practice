'use client'

import { FieldError, Path } from "react-hook-form";
import React from "react";
import classes from "../../_styles/Textarea.module.css";
import { ContactForm } from "../page";

export type TextareaProps = {
  id: Path<ContactForm>
  rows: number
  disabled?: boolean
  error?: FieldError
  placeholder?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const { id, rows, disabled, error, placeholder, ...textareaProps } = props

  return(
    <div className={classes.formContainer}>
      <label htmlFor={id} className={classes.label}>本文</label>
      <div className={classes.inputContainer}>
        <textarea
          id={id} 
          rows={rows}
          disabled={disabled}
          placeholder={placeholder}
          className={classes.textarea}
          ref={ref}
          {...textareaProps} 
        />
        {error && <div className={classes.errorMessage}>{error.message}</div>}
      </div>
    </div>
  );
})