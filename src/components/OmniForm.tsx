/**
 * This file is auto-generated, do not edit!
 * @description This is the only form that could exists in the application. Do not create any other form.
 */

import React, { useState } from "react";
import {
  Input,
  Textarea,
  Select,
  SelectItem,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
  CheckboxGroup,
  Card,
  CardBody,
} from "@heroui/react";

import { submitForm } from "@/utils/submitForm";

type BaseField = {
  name: string;
  label?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
  placeholder?: string;
};

type RegularField = BaseField & {
  type: "text" | "email" | "password" | "date" | "textarea";
};

type SelectField = BaseField & {
  type: "select";
  options: {
    label: string;
    value: string;
  }[];
};

type OptionField = BaseField & {
  type: "checkbox" | "radio";
  options: {
    label: string;
    value: string;
  }[];
};

type NumberField = BaseField & {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
};

type FileField = BaseField & {
  type: "file";
  fileType?: "image" | string;
};

type Field = RegularField | SelectField | OptionField | NumberField | FileField;

type OmniFormProps = {
  fields: Field[];
  submitLabel?: string;
  afterSubmitSuccess?: () => void;
};

export const OmniForm: React.FC<OmniFormProps> = ({
  fields,
  submitLabel = "Submit",
  afterSubmitSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialData[field.name] = field.defaultValue;
      } else if (field.type === "checkbox" || field.type === "radio") {
        initialData[field.name] = field.type === "checkbox" ? [] : "";
      } else {
        initialData[field.name] = "";
      }
    });

    return initialData;
  });

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Renders appropriate input component based on field type
   */
  const renderField = (field: Field) => {
    switch (field.type) {
      // Standard text inputs: text, email, password
      case "text":
      case "email":
      case "password":
        return (
          <Input
            isRequired={field.required}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type}
            value={formData[field.name] || ""}
            variant="bordered"
            onValueChange={(value) => handleInputChange(field.name, value)}
          />
        );

      // Date picker input
      case "date":
        return (
          <Input
            isRequired={field.required}
            label={field.label}
            placeholder={field.placeholder}
            type="date"
            value={formData[field.name] || ""}
            variant="bordered"
            onValueChange={(value) => handleInputChange(field.name, value)}
          />
        );

      // Multi-line text input
      case "textarea":
        return (
          <Textarea
            isRequired={field.required}
            label={field.label}
            minRows={4}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            variant="bordered"
            onValueChange={(value) => handleInputChange(field.name, value)}
          />
        );

      // Numeric input with optional constraints
      case "number":
        const numberField = field as NumberField;

        return (
          <Input
            isRequired={field.required}
            label={field.label}
            max={numberField.max}
            min={numberField.min}
            placeholder={field.placeholder}
            step={numberField.step}
            type="number"
            value={formData[field.name]?.toString() || ""}
            variant="bordered"
            onValueChange={(value) => {
              const numValue = value === "" ? "" : Number(value);

              handleInputChange(field.name, numValue);
            }}
          />
        );

      // Dropdown selection with predefined options
      case "select":
        const selectField = field as SelectField;

        return (
          <Select
            isRequired={field.required}
            label={field.label}
            placeholder={field.placeholder || "Select an option"}
            selectedKeys={formData[field.name] ? [formData[field.name]] : []}
            variant="bordered"
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;

              handleInputChange(field.name, value || "");
            }}
          >
            {selectField.options.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        );

      // Multiple selection checkboxes
      case "checkbox":
        const checkboxField = field as OptionField;

        return (
          <div className="flex flex-col gap-2">
            {field.label && (
              <label className="text-sm font-medium text-foreground">
                {field.label}
                {field.required && <span className="text-danger ml-1">*</span>}
              </label>
            )}
            <CheckboxGroup
              value={formData[field.name] || []}
              onValueChange={(value) => handleInputChange(field.name, value)}
            >
              {checkboxField.options.map((option) => (
                <Checkbox key={option.value} value={option.value}>
                  {option.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        );

      // Single selection radio buttons
      case "radio":
        const radioField = field as OptionField;

        return (
          <RadioGroup
            isRequired={field.required}
            label={field.label}
            value={formData[field.name] || ""}
            onValueChange={(value) => handleInputChange(field.name, value)}
          >
            {radioField.options.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </RadioGroup>
        );

      // File upload with optional type restrictions
      case "file":
        const fileField = field as FileField;
        let selectedAcceptType = "*";

        if (fileField.fileType === "image") {
          selectedAcceptType = "image/*";
        }

        return (
          <div className="flex flex-col gap-2">
            {field.label && (
              <label className="text-sm font-medium text-foreground">
                {field.label}
                {field.required && <span className="text-danger ml-1">*</span>}
              </label>
            )}
            <input
              accept={selectedAcceptType}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 border-2 border-divider rounded-lg p-2 focus:border-primary"
              type="file"
              onChange={(e) =>
                handleInputChange(field.name, e.target.files?.[0] || null)
              }
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardBody>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setIsLoading(true);
            // Create FormData from component state to properly handle files
            const submitFormData = new FormData();

            fields.forEach((field) => {
              const value = formData[field.name];

              if (field.type === "file" && value instanceof File) {
                // Handle file uploads
                submitFormData.append(field.name, value);
              } else if (field.type === "checkbox" && Array.isArray(value)) {
                // Handle checkbox arrays
                value.forEach((item) => {
                  submitFormData.append(`${field.name}[]`, item);
                });
              } else if (
                value !== undefined &&
                value !== null &&
                value !== ""
              ) {
                // Handle all other field types
                submitFormData.append(field.name, String(value));
              }
            });

            submitForm(submitFormData, () => {
              setIsLoading(false);
              afterSubmitSuccess?.();
            });
          }}
        >
          {fields.map((field, index) => (
            <div key={index}>{renderField(field)}</div>
          ))}

          <Button
            className="w-full"
            color="primary"
            isLoading={isLoading}
            size="lg"
            type="submit"
            variant="solid"
          >
            {submitLabel}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
