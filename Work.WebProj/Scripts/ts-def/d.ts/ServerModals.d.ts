declare module server {
    interface BaseEntityTable {
        edit_type?: number;
        check_del?: boolean;
        expland_sub?: boolean;
    }
    interface i_Code {
        code: string;
        langCode: string;
        value: string;
    }
    interface CUYUnit {
        sign: string;
        code: string;
    }
    interface i_Lang extends BaseEntityTable {
        lang: string;
        area: string;
        memo: string;
        isuse: boolean;
        sort: any;
    }
    interface SelectFormat {
        id: number | string;
        label: string;
    }
    interface StateTemplate extends SelectFormat {
        className?: string;
        classNameforG: string;
    }
    interface loginField {
        lang: string;
        account: string;
        password: string;
        img_vildate: string;
        rememberme: boolean;

    }
    interface AspNetRoles extends BaseEntityTable {
        Id?: string;
        Name?: string;
        aspNetUsers?: any[];
    }
    interface UserRoleInfo {
        role_id: string;
        role_use: boolean;
        role_name: string;
    }
    interface AspNetUsers extends BaseEntityTable {
        Id?: string;
        email?: string;
        emailConfirmed?: boolean;
        passwordHash?: string;
        securityStamp?: string;
        phoneNumber?: string;
        phoneNumberConfirmed?: boolean;
        twoFactorEnabled?: boolean;
        lockoutEndDateUtc?: Date;
        lockoutEnabled?: boolean;
        accessFailedCount?: number;
        UserName?: string;
        user_name_c?: string;
        department_id?: number;
        aspNetRoles?: server.AspNetRoles[];
        role_array?: Array<UserRoleInfo>;
    }
    interface Menu extends BaseEntityTable {
        menu_id?: number;
        parent_menu_id?: number;
        menu_name?: string;
        description?: string;
        area?: string;
        controller?: string;
        action?: string;
        icon_class?: string;
        sort?: number;
        is_folder?: boolean;
        is_use?: boolean;
        is_on_tablet?: boolean;
        is_only_tablet?: boolean;
        aspNetRoles?: server.AspNetRoles[];
        role_array?: Array<UserRoleInfo>;
    }
    interface Option {//分類管理選單用
        val?: number;
        Lname?: string;
    }

    interface Product_Category_L1 extends BaseEntityTable {
        product_category_l1_id?: number;
        l1_name?: string;
        l1_info?: string;
        l1_sort?: number;
        i_Hide?: boolean;
        i_Lang?: string;
        Product_Category_L2?: server.Product_Category_L2[];

    }
    interface Product_Category_L2 extends BaseEntityTable {
        product_category_l2_id?: number;
        l1_id?: number;
        l2_name?: string;
        l2_info?: string;
        l2_sort?: number;
        i_Hide?: boolean;
        i_Lang?: string;
        Product_Category_L1?: server.Product_Category_L1;

    }
    interface Product extends BaseEntityTable {
        product_id?: number;
        power?: string;
        feature?: string;
        technical_specification?: string;
        l1_id?: number;
        l2_id?: number;
        l3_id?: number;
        sort?: number;
        i_Hide?: boolean;
        i_Lang?: string;
        Product_Category_L1?: server.Product_Category_L1;
        Product_Category_L2?: server.Product_Category_L2;
    }
    interface L1 {//產品分類第一層
        l1_id?: number;
        l1_name?: string;
        l2_list?: server.L2[];
    }
    interface L2 {//產品分類第二層
        l2_id?: number;
        l2_name?: string;
    }
} 