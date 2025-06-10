/**
 * WARNING: This file should NOT be edited.
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

/**
 * Base field configuration shared by all field types
 */
type BaseField = {
  /** Unique identifier for the field - used as form data key */
  name: string;
  /** Display label for the field */
  label?: string;
  /** Whether the field is required for form submission */
  required?: boolean;
  /** Default value when form initializes */
  defaultValue?: string | number | boolean;
  /** Placeholder text shown when field is empty */
  placeholder?: string;
};

/**
 * Standard input fields: text, email, password, date, textarea
 * Example: { name: "email", type: "email", label: "Email Address", required: true }
 */
type RegularField = BaseField & {
  type: "text" | "email" | "password" | "date" | "textarea";
};

/**
 * Dropdown selection field with predefined options
 * Example: {
 *   name: "country",
 *   type: "select",
 *   label: "Country",
 *   options: [
 *     { label: "United States", value: "us" },
 *     { label: "Canada", value: "ca" }
 *   ]
 * }
 */
type SelectField = BaseField & {
  type: "select";
  options: {
    label: string;
    value: string;
  }[];
};

/**
 * Multiple choice fields: checkboxes (multiple selection) or radio buttons (single selection)
 * Checkbox example: {
 *   name: "interests",
 *   type: "checkbox",
 *   label: "Interests",
 *   options: [
 *     { label: "Sports", value: "sports" },
 *     { label: "Music", value: "music" }
 *   ]
 * }
 * Radio example: {
 *   name: "gender",
 *   type: "radio",
 *   label: "Gender",
 *   options: [
 *     { label: "Male", value: "male" },
 *     { label: "Female", value: "female" }
 *   ]
 * }
 */
type OptionField = BaseField & {
  type: "checkbox" | "radio";
  options: {
    label: string;
    value: string;
  }[];
};

/**
 * Numeric input field with optional constraints
 * Example: { name: "age", type: "number", label: "Age", min: 0, max: 120, step: 1 }
 */
type NumberField = BaseField & {
  type: "number";
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment for number input */
  step?: number;
};

/**
 * File upload field with optional file type restrictions
 * Example: { name: "avatar", type: "file", label: "Profile Picture", fileType: "image" }
 */
type FileField = BaseField & {
  type: "file";
  /** Restricts file types that can be uploaded */
  fileType?: "image" | "video" | "audio" | "document" | "other";
};

/**
 * Union type of all possible field configurations
 * Use this type when defining form fields array
 */
type Field = RegularField | SelectField | OptionField | NumberField | FileField;

/**
 * Props for the OmniForm component
 */
type OmniFormProps = {
  /** Array of field configurations that define the form structure */
  fields: Field[];
  /** Text displayed on the submit button (default: "Submit") */
  submitLabel?: string;
  /** Callback function executed after successful form submission */
  afterSubmitSuccess?: () => void;
};

/**
 * OmniForm - A universal form component that can render any form structure
 *
 * USAGE EXAMPLES:
 *
 * 1. Simple Contact Form:
 * const contactFields = [
 *   { name: "name", type: "text", label: "Full Name", required: true },
 *   { name: "email", type: "email", label: "Email", required: true },
 *   { name: "message", type: "textarea", label: "Message", placeholder: "Your message..." }
 * ];
 * <OmniForm fields={contactFields} submitLabel="Send Message" />
 *
 * 2. User Registration Form:
 * const registrationFields = [
 *   { name: "username", type: "text", label: "Username", required: true },
 *   { name: "email", type: "email", label: "Email Address", required: true },
 *   { name: "password", type: "password", label: "Password", required: true },
 *   { name: "age", type: "number", label: "Age", min: 13, max: 120 },
 *   {
 *     name: "interests",
 *     type: "checkbox",
 *     label: "Interests",
 *     options: [
 *       { label: "Technology", value: "tech" },
 *       { label: "Sports", value: "sports" },
 *       { label: "Arts", value: "arts" }
 *     ]
 *   }
 * ];
 * <OmniForm fields={registrationFields} submitLabel="Create Account" />
 *
 * 3. Survey Form:
 * const surveyFields = [
 *   {
 *     name: "satisfaction",
 *     type: "radio",
 *     label: "How satisfied are you?",
 *     options: [
 *       { label: "Very Satisfied", value: "very_satisfied" },
 *       { label: "Satisfied", value: "satisfied" },
 *       { label: "Neutral", value: "neutral" },
 *       { label: "Dissatisfied", value: "dissatisfied" }
 *     ]
 *   },
 *   {
 *     name: "country",
 *     type: "select",
 *     label: "Country",
 *     options: [
 *       { label: "United States", value: "us" },
 *       { label: "Canada", value: "ca" },
 *       { label: "United Kingdom", value: "uk" }
 *     ]
 *   }
 * ];
 * <OmniForm fields={surveyFields} submitLabel="Submit Survey" />
 *
 * FIELD TYPES REFERENCE:
 * - "text": Standard text input
 * - "email": Email input with validation
 * - "password": Password input (hidden text)
 * - "date": Date picker
 * - "textarea": Multi-line text input
 * - "number": Numeric input with optional min/max/step
 * - "select": Dropdown with options
 * - "checkbox": Multiple selection checkboxes
 * - "radio": Single selection radio buttons
 * - "file": File upload with optional type restrictions
 */
export const OmniForm: React.FC<OmniFormProps> = ({
  fields,
  submitLabel = "Submit",
  afterSubmitSuccess,
}) => {
  // Initialize form data based on field configurations
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        // Use provided default value
        initialData[field.name] = field.defaultValue;
      } else if (field.type === "checkbox" || field.type === "radio") {
        // Checkboxes start with empty array, radios with empty string
        initialData[field.name] = field.type === "checkbox" ? [] : "";
      } else {
        // All other fields start with empty string
        initialData[field.name] = "";
      }
    });

    return initialData;
  });

  // Track validation errors for each field
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Updates form data for a specific field and clears any existing error
   */
  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Validates all required fields before form submission
   * Returns true if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name];

        // Check if field is empty or (for arrays) has no selections
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.name] = `${field.label || field.name} is required`;
        }
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission with validation
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Form is valid - log data and trigger success callback
      // eslint-disable-next-line no-console
      console.log(formData);
      afterSubmitSuccess?.();
    }
  };

  /**
   * Renders appropriate input component based on field type
   */
  const renderField = (field: Field) => {
    const isInvalid = !!errors[field.name];
    const errorMessage = errors[field.name];

    switch (field.type) {
      // Standard text inputs: text, email, password
      case "text":
      case "email":
      case "password":
        return (
          <Input
            errorMessage={errorMessage}
            isInvalid={isInvalid}
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
            errorMessage={errorMessage}
            isInvalid={isInvalid}
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
            errorMessage={errorMessage}
            isInvalid={isInvalid}
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
            errorMessage={errorMessage}
            isInvalid={isInvalid}
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
            errorMessage={errorMessage}
            isInvalid={isInvalid}
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
              errorMessage={errorMessage}
              isInvalid={isInvalid}
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
            errorMessage={errorMessage}
            isInvalid={isInvalid}
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
        const acceptTypes = {
          image: "image/*",
          video: "video/*",
          audio: "audio/*",
          document: ".pdf,.doc,.docx,.txt",
          other: "*",
        };

        return (
          <div className="flex flex-col gap-2">
            {field.label && (
              <label className="text-sm font-medium text-foreground">
                {field.label}
                {field.required && <span className="text-danger ml-1">*</span>}
              </label>
            )}
            <input
              accept={
                fileField.fileType ? acceptTypes[fileField.fileType] : "*"
              }
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 border-2 border-divider rounded-lg p-2 focus:border-primary"
              type="file"
              onChange={(e) =>
                handleInputChange(field.name, e.target.files?.[0] || null)
              }
            />
            {isInvalid && <p className="text-danger text-sm">{errorMessage}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardBody>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Render each field based on its configuration */}
          {fields.map((field, index) => (
            <div key={index}>{renderField(field)}</div>
          ))}

          {/* Submit button */}
          <Button
            className="w-full"
            color="primary"
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
