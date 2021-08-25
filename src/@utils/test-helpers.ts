type ValidationType = 'required' | 'max' | 'min';
type ValidationRules = {
  validationType: ValidationType;
  invalidValue: string;
};

export type TargetInput = {
  label: string;
  value: string;
  initialState: string;
  validationRules?: ValidationRules[];
};

export type TargetInvalidInput = {
  label: string;
  invalidValue: string;
  description: string;
};

function getTestDescription(label: string) {
  return {
    required: () => `should a be a required field [${label}]`,
    max: () => `should have a max value [${label}]`,
    min: () => `should have a min value [${label}[]`,
  };
}

export class TestFormBuilder {
  private targetInputs: TargetInput[] = [];
  private invalidInputs: TargetInvalidInput[] = [];

  constructor() {}

  public append(
    label: string,
    value: string,
    initialState: string,
    validationRules?: ValidationRules[]
  ) {
    const target = {
      label,
      value,
      initialState,
      validationRules,
    };
    this.targetInputs.push(target);
    this.appendInvalidInput(target);
  }

  private appendInvalidInput(target: TargetInput) {
    target.validationRules?.forEach(rule => {
      const descriptionFn = getTestDescription(target.label)[
        rule.validationType
      ];
      const invalidInput: TargetInvalidInput = {
        label: target.label,
        invalidValue: rule.invalidValue,
        description: descriptionFn && descriptionFn(),
      };
      this.invalidInputs.push(invalidInput);
    });
  }

  public build() {
    return {
      targetInputs: this.targetInputs,
      invalidInputs: this.invalidInputs,
    };
  }
}
