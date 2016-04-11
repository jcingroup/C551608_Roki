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
    interface Banner extends BaseEntityTable {
        banner_id?: number;
        banner_name?: string;
        sort?: number;
        i_Hide?: boolean;
        i_Lang?: string;
    }
    interface Community extends BaseEntityTable {
        community_id?: number;
        community_name?: string;
        account?: string;
        passwd?: string;
        intro?: string;
    }
    interface Community_News {
        community_news_id?: number;
        community_id?: number;
        title?: string;
        context?: string;
        start_date?: Date;
        end_date?: Date;
        state?: string;
        community_name?: string;
    }
    interface Edit extends BaseEntityTable {
        edit_id?: number;
        edit_name?: string;
        edit_content?: string;
        sort?: number;
    }
    interface Matter {
        matter_id?: number;
        community_id?: number;
        zip?: string;
        city?: string;
        country?: string;
        address?: string;
        bedrooms?: number;
        livingrooms?: number;
        bathrooms?: number;
        rooms?: number;
        build_area?: number;
        land_area?: number;
        house_area?: number;
        balcony_area?: number;
        umbrella_aea?: number;
        public_area?: number;
        age?: number;
        buildhouses?: number;
        typeOfHouse?: string;
        managementFeeOfMonth?: number;
        architecture?: string;
        parking?: string;
        orientation?: string;
        guard?: string;
        is_end?: boolean;
        is_darkroom?: boolean;
        wall_materials?: string;
        matter_name?: string;
        info_type?: string;
        start_date?: Date;
        end_date?: Date;
        state?: string;
    }
} 