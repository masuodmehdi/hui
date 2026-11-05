[settings]
functionname = hi_adapter_cli_lsw_port_set_pri;
attributenum = 4;
attributeflag= 1;

[parameter]
attribute=alias<port>     type<uint>     range<0x0,0x7>       default<0>;
attribute=alias<pri>     type<uchar>   range<0x0,0xff>       default<0>;
attribute=alias<res>      type<uchar>    range<0x0,0x0>       default<0>;
attribute=alias<res1>     type<ushort>   range<0x0,0x0>       default<0>;

[help]
typedef struct
{
    hi_lsw_port_e em_port;
    hi_uint32     ui_dir; /* 表示方向 */
    hi_uint32     ui_tagtype;
    hi_uint32     ui_tagact;
}hi_lsw_port_tag_act_s;

/*端口号定义*/
typedef enum
{
    HI_LSW_PORT_GE0_E   = 0,
    HI_LSW_PORT_FE1_E   = 1,
    HI_LSW_PORT_FE2_E   = 2,
    HI_LSW_PORT_FE3_E   = 3,
    HI_LSW_PORT_FE4_E   = 4,
    HI_LSW_PORT_PON_E   = 5,
    HI_LSW_PORT_CPU_E   = 6,
    HI_LSW_PORT_MAX_E,
}hi_lsw_port_e;

/* 方向定义 */
typedef enum 
{
    HI_LSW_IGR_TAG_ACT_E = 0,                                     /* 表示入口方向 */
    HI_LSW_EGR_TAG_ACT_E,                                     /* 表示出口方向*/
}hi_lsw_inout_e;

typedef enum 
{
    HI_LSW_TAG_ACT_E    = 0,                                     /* tag      动作 */
    HI_LSW_PRI_TAG_ACT_E,                                  /* pri tag 动作*/
    HI_LSW_UATAG_ACT_E,                                     /* untag  动作*/ 
}hi_lsw_tag_type_e;

typedef enum
{
    HI_LSW_TAG_NO_ACTION_E = 0,        
    HI_LSW_TAG_ADD_E,
    HI_LSW_TAG_DEL_E,    
    HI_LSW_TAG_DROP_E,
    HI_LSW_TAG_DEFAULT_DROP_E,
    HI_LSW_TAG_REP_OUTER_DEFAULT_E,     
    HI_LSW_TAG_REP_OUTER_TRANS_DROP_E, 
    HI_LSW_TAG_REP_OUTER_TRANS_TRUE_E,
    HI_LSW_TAG_CHECK_E,  
    HI_LSW_TAG_SWITCH_E, 
    HI_LSW_TAG_HYBRID_E,
    HI_LSW_TAG_ACT_NUM_E,
}hi_lsw_tag_act_e;


de],
			['GE', g_countryChannel.ge, wlan_country_ge],
			['GR', g_countryChannel.gr, wlan_country_gr],
			['GT', g_countryChannel.gt, wlan_country_gt],
			['HN', g_countryChannel.hn, wlan_country_hn],
			['HK', g_countryChannel.hk, wlan_country_hk],
			['HU', g_countryChannel.hu, wlan_country_hu],
			['IS', g_countryChannel.is, wlan_country_is],
			['IN', g_countryChannel.ind, wlan_country_in],
			['ID', g_countryChannel.id, wlan_country_id],
			['IE', g_countryChannel.ie, wlan_country_ie],
			['IL', g_countryChannel.il, wlan_country_il],
			['IT', g_countryChannel.it, wlan_country_it],
			['JP', g_countryChannel.jr, wlan_country_jp],
			['JO', g_countryChannel.jo, wlan_country_jo],
			['KZ', g_countryChannel.kz, wlan_country_kz],
			['KR', g_countryChannel.kr, wlan_country_kr],
			['KW', g_countryChannel.kw, wlan_country_kw],
			['LB', g_countryChannel.lb, wlan_country_lb],
			['LV', g_countryChannel.lv, wlan_country_lv],
			['LI', g_countryChannel.li, wlan_country_li],
			['LT', g_countryChannel.lt, wlan_country_lt],
			['LU', g_countryChannel.lu, wlan_country_lu],
			['MA', g_countryChannel.ma, wlan_country_ma],
			['MK', g_countryChannel.mk, wlan_country_mk],
			['MY', g_countryChannel.my, wlan_country_my],
			['MO', g_countryChannel.mo, wlan_country_mo],
			['MX', g_countryChannel.mx, wlan_country_mx],
			['MC', g_countryChannel.mc, wlan_country_mc],
			['NL', g_countryChannel.nl, wlan_country_nl],
			['NZ', g_countryChannel.nz, wlan_country_nz],
			['NO', g_countryChannel.no, wlan_country_no],
			['OM', g_countryChannel.om, wlan_country_om],
			['PK', g_countryChannel.pk, wlan_country_pk],
			['PA', g_countryChannel.pa, wlan_country_pa],
			['PE', g_countryChannel.pe, wlan_country_pe],
			['PH', g_countryChannel.ph, wlan_country_ph],
			['PL', g_countryChannel.pl, wlan_country_pl],
			['PT', g_countryChannel.pt, wlan_country_pt],
			['PR', g_countryChannel.pr, wlan_country_pr],
			['QA', g_countryChannel.qa, wlan_country_qa],
			['RO', g_countryChannel.ro, wlan_country_ro],
			['RU', g_countryChannel.ru, wlan_country_ru],
			['SA', g_countryChannel.sa, wlan_country_sa],
			['SG', g_countryChannel.sg, wlan_country_sg],
			['SK', g_countryChannel.sk, wlan_country_sk],
			['SI', g_countryChannel.si, wlan_country_si],
			['ZA', g_countryChannel.za, wlan_country_za],
			['ES', g_countryChannel.es, wlan_country_es],
			['SE', g_countryChannel.se, wlan_country_se],
			['CH', g_countryChannel.ch, wlan_country_ch],
			['TW', g_countryChannel.tw, wlan_country_tw],
			['TH', g_countryChannel.th, wlan_country_th],
			['TT', g_countryChannel.tt, wlan_country_tt],
			['TN', g_countryChannel.tn, wlan_country_tn],
			['TR', g_countryChannel.tr, wlan_country_tr],
			['UA', g_countryChannel.ua, wlan_country_ua],
			['AE', g_countryChannel.ae, wlan_country_ae],
			['GB', g_countryChannel.gb, wlan_country_gb],
			['US', g_countryChannel.us, wlan_country_us],
			['UY', g_countryChannel.uy, wlan_country_uy],
			['UZ', g_countryChannel.uz, wlan_country_uz],
			['VE', g_countryChannel.ve, wlan_country_ve],
			['VN', g_countryChannel.vn, wlan_country_vn],
			['YE', g_countryChannel.ye, wlan_country_ye],
			['ZW', g_countryChannel.zw, wlan_country_zw]
];
    }, {
        sync: true
    });
}
getConfig();