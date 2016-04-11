declare module "react-datepicker" {
    interface ReactDatepickerProps extends React.Props<ReactDatepickerClass> {
        weekdays?: Array<string>,
        locale?: string,
        dateFormatCalendar?: string,
        popoverAttachment?: string,
        popoverTargetAttachment?: string,
        popoverTargetOffset?: string,
        weekStart?: string,
        onChange: Function,
        onBlur?: Function,
        onFocus?: Function,
        selected?: moment.Moment,
        isClearable?: boolean,
        dateFormat?: string,
        showYearDropdown?: any,
        className?: string,
        required?: boolean,
        startDate?: moment.Moment,
        endDate?: moment.Moment,
        minDate?: moment.Moment,
        maxDate?: moment.Moment,
        disabled?: boolean
    }
    interface ReactDatepicker extends React.ReactElement<ReactDatepickerProps> { }
    interface ReactDatepickerClass extends React.ComponentClass<ReactDatepickerProps> {
    }
    var ReactDatepicker: ReactDatepickerClass;
    export = ReactDatepicker;
}