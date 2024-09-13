export type StoreValue = any;

type Validator = (
    rule: RuleObject,
    value: StoreValue,
    callback: (error?: string) => void,
) => Promise<void | any> | void;

type RuleType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'method'
    | 'regexp'
    | 'integer'
    | 'float'
    | 'object'
    | 'enum'
    | 'date'
    | 'url'
    | 'hex'
    | 'email';

interface BaseRule {
    enum?: StoreValue[];
    len?: number;
    max?: number;
    message?: string | React.ReactElement;
    min?: number;
    pattern?: RegExp;
    required?: boolean;
    transform?: (value: StoreValue) => StoreValue;
    type?: RuleType;
    whitespace?: boolean;
    /** Customize rule level `validateTrigger`. Must be subset of Field `validateTrigger` */
    validateTrigger?: string | string[];
}

interface ValidatorRule {
    message?: string | React.ReactElement;
    validator: Validator;
}

type AggregationRule = BaseRule & Partial<ValidatorRule>;
interface ArrayRule extends Omit<AggregationRule, 'type'> {
    type: 'array';
    defaultField?: RuleObject;
}

type RuleRender = (form: any) => RuleObject;

export type RuleObject = AggregationRule | ArrayRule;

export type Rule = RuleObject | RuleRender;
