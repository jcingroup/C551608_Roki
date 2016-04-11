interface GridNavPageProps extends React.Props<GridNavPageClass> {
    queryGridData(page: number): void,
    insertType(): void,
    deleteSubmit(): void,
    nowPage: number,
    totalPage: number,
    startCount: number,
    endCount: number,
    recordCount: number,
    showAdd?: boolean,
    showDelete?: boolean
}
interface GridNavPageClass extends React.ComponentClass<GridNavPageProps> {

}
interface GridButtonModifyProps extends React.Props<GridButtonModifyClass> {
    modify(): void
}
interface GridButtonModifyClass extends React.ComponentClass<GridButtonModifyProps> {

}
interface GridCheckDelProps extends React.Props<GridCheckDelClass> {
    delCheck(p1: any, p2: any): void,
    iKey: number,
    chd: boolean,
    showAdd?: boolean
}
interface GridCheckDelClass extends React.ComponentClass<GridCheckDelProps> {
}
//GridButtonDel
interface GridButtonDelProps extends React.Props<GridButtonDelClass> {
    removeItemSubmit(primkey: number | string): void,
    showButton?: boolean,
    primKey: number | string
}
interface GridButtonDelClass extends React.ComponentClass<GridButtonDelProps> {
}
//InputDate
interface InputDateProps extends React.Props<InputDateClass> {
    id: string,
    value: Date,
    onChange(field_name: string, date_value: Date): void,
    field_name: string,
    required: boolean,
    disabled: boolean,
    ver: number
}
interface InputDateClass extends React.ComponentClass<InputDateProps> {
}
interface TipsProps extends React.Props<TipsClass> {
    comment: string;
    children?: any;
}
interface TipsClass extends React.ComponentClass<TipsProps> {
}
interface MasterImageUploadProps extends React.Props<MasterImageUploadClass> {
    url_upload?: string,
    url_list?: string,
    url_delete?: string,
    url_download?: string,
    url_sort?: string,
    FileKind?: string,
    MainId: number | string,
    ParentEditType?: number
}
interface MasterImageUploadClass extends React.ComponentClass<MasterImageUploadProps> {
}
interface MasterFileUploadProps extends React.Props<MasterFileUploadClass> {
    url_upload?: string,
    url_list?: string,
    url_delete?: string,
    url_download?: string,
    url_sort?: string,
    FileKind?: string,
    MainId: number | string,
    ParentEditType?: number
}
interface MasterFileUploadClass extends React.ComponentClass<MasterFileUploadProps> {
}

interface TwAddressClass extends React.ComponentClass<TwAddressProps> {
}
interface TwAddressProps extends React.Props<TwAddressClass> {
    identity: string, //識別字串
    index: number,
    onChange(data: {
        identity: string,
        zip_value: string,
        city_value: string,
        country_value: string,
        address_value: string,
        index: number,
        type: number //1:zip 2:city 3:country 4:address
    }, e: React.SyntheticEvent): void,
    zip_value: string,
    city_value: string,
    country_value: string,
    address_value: string,
    required?: boolean,
    disabled?: boolean,
    ver?: number
}
interface StateForGirdProps extends React.Props<StateForGirdClass> {
    stateData: Array<server.StateTemplate>, id: number | string, ver?: number
}
interface StateForGirdClass extends React.ComponentClass<StateForGirdProps> {
}
declare module __comm_cmpt {
    class GridNavPage extends React.Component<GridNavPageProps, any> { }
    class GridButtonModify extends React.Component<GridButtonModifyProps, any> { }
    class GridCheckDel extends React.Component<GridCheckDelProps, any> { }
    class GridButtonDel extends React.Component<GridButtonDelProps, any> {

    }
    class InputDate extends React.Component<InputDateProps, any> {
    }
    class Tips extends React.Component<TipsProps, any> {

    }
    class MasterImageUpload extends React.Component<MasterImageUploadProps, any> { }
    class MasterFileUpload extends React.Component<MasterFileUploadProps, any> { }
    class TwAddress extends React.Component<TwAddressProps, any> { }
    class StateForGird extends React.Component<StateForGirdProps, any> { }
}

declare module "comm-cmpt" {
    export = __comm_cmpt;
}