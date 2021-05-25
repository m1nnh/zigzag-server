module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요." },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력해주세요." },
    SIGNUP_PASSWORD_ERROR_TYPE : { "isSuccess": false, "code": 2005, "message":"비밀번호는 영문, 숫자, 특수문자 포함 8~16 자리를 입력해주세요." },
    SIGNUP_PHONE_EMPTY : { "isSuccess": false, "code": 2006, "message":"휴대폰 번호를 입력해주세요." },
    SIGNUP_PHONE_ERROR_TYPE : { "isSuccess": false,"code": 2007,"message":"휴대폰 번호 형식에 맞춰 입력해주세요. ex) 01012341234" },
    SIGNUP_SMSFLAG_EMPTY : { "isSuccess": false, "code": 2008, "message":"SMS FLAG를 입력해주세요." },
    SIGNUP_SMSFLAG_ERROR_TYPE : { "isSuccess": false, "code": 2009, "message":"SMS FLAG는 Y 또는 N을 입력해주세요." },
    SIGNUP_EMAILFLAG_EMPTY : { "isSuccess": false, "code": 2010, "message":"EMAIL FLAG를 입력해주세요." },
    SIGNUP_EMAILFLAG_ERROR_TYPE : { "isSuccess": false, "code": 2011, "message":"EMAIL FLAG는 Y 또는 N을 입력해주세요." },
    PAGE_EMPTY : { "isSuccess": false, "code": 2012, "message":"page를 입력해주세요." },
    PAGE_ERROR_TYPE : { "isSuccess": false, "code": 2013, "message":"page 번호를 확인해주세요." },
    SIZE_EMPTY : { "isSuccess": false, "code": 2014, "message":"size를 입력해주세요." },
    SIZE_ERROR_TYPE : { "isSuccess": false, "code": 2015, "message":"size 번호를 확인해주세요." },
    USER_USERID_EMPTY : { "isSuccess": false, "code": 2016, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2017, "message": "해당 회원이 존재하지 않습니다." },
    PASSWORD_EMPTY : { "isSuccess": false, "code": 2018, "message": "비밀번호를 입력해주세요." },
    PASSWORD_LENGTH : { "isSuccess": false, "code": 2019, "message": "6자리 이상의 비밀번호를 입력해주세요." },
    ID_NOT_MATCHING : { "isSuccess": false, "code": 2020, "message": "userId가 다릅니다." },
    NAME_EMPTY : { "isSuccess": false, "code": 2021, "message": "이름을 입력해주세요." },
    NAME_ERROR_TYPE : { "isSuccess": false, "code": 2022, "message": "이름을 형식에 맞게 입력해주세요." },
    EMAIL_NOT_EMPTY : { "isSuccess": false, "code": 2023, "message": "해당 이메일이 존재하지 않습니다." },












    PRODUCT_CATEGORYIDX_EMPTY : {"isSuccess": false, "code": 2100, "message": "categoryIdx를 입력해 주세요." },
    PRODUCT_CATEGORYIDX_STYLE : {"isSuccess": false, "code": 2101, "message": "categoryIdx를 형식에 맞게 입력해 주세요." },
    PRODUCT_PAGE_EMPTY : {"isSuccess": false, "code": 2102, "message": "page를 입력해 주세요." },
    PRODUCT_PAGE_STYLE : {"isSuccess": false, "code": 2103, "message": "page를 형식에 맞게 입력해 주세요." },
    PRODUCT_SIZE_EMPTY : {"isSuccess": false, "code": 2104, "message": "size를 입력해 주세요." },
    PRODUCT_SIZE_STYLE : {"isSuccess": false, "code": 2105, "message": "size를 형식에 맞게 입력해 주세요." },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_PHONENUM : { "isSuccess": false, "code": 3002, "message":"중복된 휴대폰 번호입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "이메일이 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
