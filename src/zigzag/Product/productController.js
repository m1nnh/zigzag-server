const jwtMiddleware = require("../../../config/jwtMiddleware");
const productProvider = require("../../app/Product/productProvider");
const productService = require("../../app/Product/productService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");
const { SUCCESS } = require("../../../config/baseResponseStatus");

// regex 
const regPage = /^[0-9]/g;
const regSize = /^[0-9]/g;
const regNum = /^[0-9]/g;

/**
 * API No. 9
 * API Name : 홈 상품 조회 API
 * [GET] /products/home
 */
 exports.getHome = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size} = req.query;
    
    // Request Body
    const bodyIdx = req.body;
    
    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) & page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) & size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.

    page = size * (page-1);

    // Home Product Result
    let homeResult = await productProvider.homeProduct(page, size);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Home Product Result <- Status
    for (var i = 0; i < homeResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (homeResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                homeResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Home Product Result 'N' Insert
        if (flag === 0)
            homeResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, homeResult));

}

/**
 * API No. 10
 * API Name : 홈 슬라이드 상품 조회 API
 * [GET] /products/home-slide
 */
exports.getHomeSlide = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Body
    const bodyIdx = req.body;
    
    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    // Home Product Result
    let homeSlideResult = await productProvider.homeSlideProduct();

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Home Slide Product Result <- Status
    for (var i = 0; i < homeSlideResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (homeSlideResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                homeSlideResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Home Product Result 'N' Insert
        if (flag === 0)
            homeSlideResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, homeSlideResult));

 }

 /**
 * API No. 11
 * API Name : 브랜드 상품 조회 API
 * [GET] /products/brand
 */
exports.getBrand = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size} = req.query;
    
    // Request Body
    const bodyIdx = req.body;

    let brandIdx = Math.floor(Math.random() * 10) + 1;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) & page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) & size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.
    
    page = size * (page-1);

    // Brand Product Result
    let brandResult = await productProvider.brandProduct(page, size, brandIdx);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Brand Product Result <- Status
    for (var i = 0; i < brandResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (brandResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                brandResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Brand Product Result 'N' Insert
        if (flag === 0)
            brandResult[i]["likeProductStatus"] = 'N';
    }

    return res.send(response(baseResponse.SUCCESS, brandResult));

}

 /**
 * API No. 12
 * API Name : top3 브랜드 상품 조회 API
 * [GET] /products/top3-brand
 */
exports.getBrandRank = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    var {large} = req.query;

    // Request Body
    const bodyIdx = req.body;

    var condition = ''

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.


    // Category Filtering
    if (large) {
        if (large == 1) {
            large = parseInt(large) + 1
            var firstCategoryIdxRow = await productProvider.categoryIdx(large);
            large = parseInt(large) + 5
            let first = firstCategoryIdxRow[1].categoryIdx;

            var secondCategoryIdxRow = await productProvider.categoryIdx(large);
            let last = secondCategoryIdxRow[secondCategoryIdxRow.length - 1].categoryIdx;

            condition += 'and categoryRef between ' + first + ' and ' + last
        }

        else if (large == 2) {
            large = parseInt(large) + 6
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition += 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 3) {
            large = parseInt(large) + 4
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 4) {
            large = parseInt(large) + 8
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 5) {
            large = parseInt(large) + 4
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 6) {
            large = parseInt(large) + 4
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else 
            return res.send(errResponse(baseResponse.LARGE_ERROR_TYPE)); // 2024 : large 번호를 확인해주세요.
    }
    else
        condition = ''

    // Rank Result
    var rankResult = await productProvider.brandRank(condition);

    // Bookmark Status
    var bookMarkStatus = await productProvider.bookMarkStatus(userIdx);

    // Rank Result <- Status
    for (var i = 0; i < rankResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < bookMarkStatus.length; j++) {
            
            if (rankResult[i].brandIdx === bookMarkStatus[j].brandIdx) {
                rankResult[i]["bookMarkStatus"] = bookMarkStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Rank Result 'N' Insert
        if (flag === 0)
            rankResult[i]["bookMarkStatus"] = 'N';
    }

    // Rank Result <- Product
    for (var i = 0; i < 3; i++) {
        
        if (i >= rankResult.length )
            break;

        var brandProductResult = await productProvider.brandRankProduct(rankResult[i].brandIdx);
        rankResult[i]["product"] = brandProductResult;
    }

    return res.send(response(baseResponse.SUCCESS,rankResult));

}

/**
 * API No. 13
 * API Name : 랭킹별 브랜드 상품 조회 API
 * [GET] /products/rank-brand
 */
exports.getTotalRank = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    var {page, size, large} = req.query;

    // Request Body
    const bodyIdx = req.body;

    var condition = ''

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) && page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) && size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.


    // Category Filtering
    if (large) {
        if (large == 1) {
            large = parseInt(large) + 1
            var firstCategoryIdxRow = await productProvider.categoryIdx(large);
            large = parseInt(large) + 5
            let first = firstCategoryIdxRow[1].categoryIdx;

            var secondCategoryIdxRow = await productProvider.categoryIdx(large);
            let last = secondCategoryIdxRow[secondCategoryIdxRow.length - 1].categoryIdx;

            condition += 'and categoryRef between ' + first + ' and ' + last
        }

        else if (large == 2) {
            large = parseInt(large) + 6
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition += 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 3) {
            large = parseInt(large) + 4
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 4) {
            large = parseInt(large) + 8
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 5) {
            large = parseInt(large) + 4
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 6) {
            large = parseInt(large) + 4
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else 
            return res.send(errResponse(baseResponse.LARGE_ERROR_TYPE)); // 2024 : large 번호를 확인해주세요.
    }
    else
        condition = ''

    // Rank Result
    var rankResult = await productProvider.brandTotalRank(page, size, condition);

    // Bookmark Status
    var bookMarkStatus = await productProvider.bookMarkStatus(userIdx);

    // Rank Result <- Status
    for (var i = 0; i < rankResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < bookMarkStatus.length; j++) {
            
            if (rankResult[i].brandIdx === bookMarkStatus[j].brandIdx) {
                rankResult[i]["bookMarkStatus"] = bookMarkStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Rank Result 'N' Insert
        if (flag === 0)
            rankResult[i]["bookMarkStatus"] = 'N';
    }

    // Rank Result <- Product
    for (var i = 0; i < rankResult.length; i++) {
        
        var brandProductResult = await productProvider.brandRankProduct(rankResult[i].brandIdx);
        rankResult[i]["product"] = brandProductResult;
    }

    return res.send(response(baseResponse.SUCCESS,rankResult));

}


/**
 * API No. 14
 * API Name : 브랜드별 이번 주 베스트 상품 조회 API
 * [GET] /products/:brandIdx/week-best
 */
exports.getWeekBest = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Body
    const bodyIdx = req.body;

    // Request Path Variable
    const {brandIdx} = req.params;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.
    
    const checkBrandIdx = await productProvider.brandIdxCheck(brandIdx);

    if (checkBrandIdx[0].exisit === 0)
        return res.send(errResponse(baseResponse.BRANDIDX_NOT_EXIST)) // 2035 : 해당 브랜드가 존재하지 않습니다.
    
    // categoryIdx, categoryName
    const categoryList = await productProvider.categoryList(brandIdx);
    
    // Week Best Product Result
    let weekBestResult = await productProvider.weekBestProduct(brandIdx);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Home Slide Product Result <- Status
    for (var i = 0; i < weekBestResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (weekBestResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                weekBestResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Home Product Result 'N' Insert
        if (flag === 0)
            weekBestResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, {categoryList, weekBestResult}));

 }

 /**
 * API No. 15
 * API Name : 브랜드별 카테고리 상품 조회 API
 * [GET] /products/:brandIdx/category
 */
exports.getBrandCategory = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size, categoryIdx, filter} = req.query;
    
    // Request Path Varialbe
    const {brandIdx} = req.params;

    // Request Body
    const bodyIdx = req.body;

    var condition = 'order by '
    var category = ''

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) & page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) & size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.

        const checkBrandIdx = await productProvider.brandIdxCheck(brandIdx);

    if (checkBrandIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.BRANDIDX_NOT_EXIST)); // 2035 : 해당 브랜드가 존재하지 않습니다.
        
    if (categoryIdx.length > 0) {
        const checkCategoryIdx = await productProvider.categoryCheck(brandIdx, categoryIdx);

        if (checkCategoryIdx[0].exist === 0)
            return res.send(errResponse(baseResponse.CATEGORYIDX_ERROR_TYPE)) // 2027 categoryIdx 번호를 확인해주세요.

        category = ' and c.categoryIdx = ' + categoryIdx }
    else 
        category = ''

    switch(filter) {
        case '1' : condition += 'ifnull(readCount, 0) + ifnull(sum(pb.productNum), 0) DESC'; break;
        case '2' : condition += 'ifnull(reviewCount, 0) DESC'; break;
        case '3' : condition += 'productPrice * ((100 - productSale) / 100) ASC'; break;
        case '4' : condition += 'productPrice * ((100 - productSale) / 100) DESC'; break;
        default : condition += 'p.createdAt DESC'; break;
    } 
    
    page = size * (page-1);

    // Category Product Result
    const categoryProductResult = await productProvider.brandCategoryProduct(page, size, category, condition, brandIdx);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Best Product Result <- Status
    for (var i = 0; i < categoryProductResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (categoryProductResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                categoryProductResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Best Product 'N' Insert
        if (flag === 0)
        categoryProductResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, categoryProductResult));
}

 

 /**
 * API No. 16
 * API Name : 베스트 상품 조회 API
 * [GET] /products/best
 */
exports.getBest = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size, large, agefilter} = req.query;
    
    // Request Body
    const bodyIdx = req.body;

    var condition = 'where p.status = ' + 'N '
    var agecondition = ' and u.birth between '

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) & page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) & size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.
    
    // Category Filtering
    if (large) {
        if (large > 0 & large < 13)
        {
            large = parseInt(large) + 1
            const categoryIdxRow = await productProvider.categoryIdx(large);
            const first = categoryIdxRow[1].categoryIdx;
            const last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }
        else 
            return res.send(errResponse(baseResponse.LARGE_ERROR_TYPE)); // 2024 : large 번호를 확인해주세요. 
    }
    else
        condition = 'where p.status = ' + 'N'

    // Age Filtering
    switch (agefilter) {
        case '1' : agecondition += '2003 and 2012'; break;
        case '2' : agecondition += '1993 and 2002'; break;
        case '3' : agecondition += '1983 and 1992'; break;
        default : agecondition = ''; break;
    }

    page = size * (page-1);

    // Best Product Result
    const bestResult = await productProvider.bestProduct(page, size, condition, agecondition);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Best Product Result <- Status
    for (var i = 0; i < bestResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (bestResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                bestResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Best Product 'N' Insert
        if (flag === 0)
            bestResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, bestResult));
}

/**
 * API No. 17
 * API Name : 타임 특가 상품 조회 API
 * [GET] /products/time-sale
 */
exports.getTimeSale = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size} = req.query;
    
    // Request Body
    const bodyIdx = req.body;
    
    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) & page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) & size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.

    page = size * (page-1);

    // Time Sale Product Result
    let timeSaleProductResult = await productProvider.timeSaleProduct(page, size);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Time Sale Product Result <- Status
    for (var i = 0; i < timeSaleProductResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (timeSaleProductResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                timeSaleProductResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Home Product Result 'N' Insert
        if (flag === 0)
        timeSaleProductResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, timeSaleProductResult));
}

/**
 * API No. 18
 * API Name : 혜택 상품 조회 API (슬라이드)
 * [GET] /products/benefit
 */
exports.benefit = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;


    // Request Body
    const bodyIdx = req.body;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    var jbRandom = Math.random();
    let categoryRef = Math.floor(jbRandom * 104 + 14);

    // Benefit Product Result
    const saleProductResult = await productProvider.benefitProduct(categoryRef);
        
    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // sale Product Result <- Status
    for (var i = 0; i < saleProductResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (saleProductResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                saleProductResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // sale Product Result 'N' Insert
        if (flag === 0)
        saleProductResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, saleProductResult));

 }



/**
 * API No. 19
 * API Name : 혜택 상품 카테고리별 전체 조회 API
 * [GET] /products/:categoryRef/benefit
 */
exports.getSale = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    let {categoryRef} = req.params;

    // Request Query String
    let {page, size} = req.query;

    // Request Body
    const bodyIdx = req.body;

    let condition = '';
    let saleProductResult;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (categoryRef != 1 & (categoryRef < 15 || categoryRef > 104))
        return res.send(errResponse(baseResponse.CATEGORYREF_ERROR_TYPE)); // 2025 : categoryRef 번호를 확인해주세요.
    

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) && page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) && size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.
    
    page = size * (page-1);

    // sale Product Result
    if (categoryRef == 1) {

        condition += ' and s.deliveryPrice = 0'
        saleProductResult = await productProvider.saleProduct(condition, page, size, categoryRef);
    }
    else {
        condition += ' and c.categoryRef = ' + categoryRef;
        saleProductResult = await productProvider.saleProduct(condition, page, size, categoryRef);
        
    }
    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // sale Product Result <- Status
    for (var i = 0; i < saleProductResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (saleProductResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                saleProductResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // sale Product Result 'N' Insert
        if (flag === 0)
        saleProductResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, saleProductResult));

 }

 /**
 * API No. 20
 * API Name : 신상/혜택 상품 조회 API
 * [GET] /products/new-sale
 */
exports.getNewSale = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size, large} = req.query;
    
    // Request Body
    const bodyIdx = req.body;

    let condition = ''

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) && page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) && size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.
    
    // Category Filtering
    if (large) {
        if (large > 0 && large < 13)
        {
            large = parseInt(large) + 1
            const categoryIdxRow = await productProvider.categoryIdx(large);
            const first = categoryIdxRow[1].categoryIdx;
            const last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and c.categoryRef between ' + first + ' and ' + last;
        }
        else 
            return res.send(errResponse(baseResponse.LARGE_ERROR_TYPE)); // 2024 : large 번호를 확인해주세요. 
    }
    else
        condition = ''

    page = size * (page-1);

    // New Sale Product Result
    const newSaleProductResult = await productProvider.newSaleProduct(page, size, condition);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Best Product Result <- Status
    for (var i = 0; i < newSaleProductResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (newSaleProductResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                newSaleProductResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Best Product 'N' Insert
        if (flag === 0)
            newSaleProductResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, newSaleProductResult));
}

/**
 * API No. 21
 * API Name : 신상품 조회 API
 * [GET] /products/new
 */
exports.getNew = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size} = req.query;
    
    // Request Body
    const bodyIdx = req.body;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) && page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) && size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.

    page = size * (page-1);

    // Home Product Result
    let newProductResult = await productProvider.newProduct(page, size);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // New Product Result <- Status
    for (var i = 0; i < newProductResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (newProductResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                newProductResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // New Product Result 'N' Insert
        if (flag === 0)
            newProductResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, newProductResult));

 }

 /**
 * API No. 22
 * API Name : 상품 인트로 조회 API
 * [GET] /products/:productIdx
 */

 exports.getProductIntro = async function(req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {productIdx} = req.params;

    // Request Body
    const bodyIdx = req.body;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(productIdx) && productIdx < 1)
        return res.send(response(baseResponse.STOREIDX_ONLY_NUMBER)); // 2031 : productIdx는 숫자만 입력이 가능합니다.
    
    const checkProductIdx = await productProvider.productIdxCheck(productIdx);

    if (checkProductIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.PRODUCTIDX_NOT_EXIST)) // 2026 : 존재하지 않는 상품입니다.

    // Intro Result
    const productIntroResult = await productProvider.productIntro(productIdx, userIdx)

    return res.send(response(baseResponse.SUCCESS, productIntroResult));

 }

 /**
 * API No. 23
 * API Name : 상품별 쿠폰 리스트 조회 API
 * [GET] /products/:productIdx/coupon-list
 */
exports.getProductCoupon = async function(req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {productIdx} = req.params;

    // Request Body
    const bodyIdx = req.body;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(productIdx) && productIdx < 1)
        return res.send(response(baseResponse.PRODUCTIDX_ONLY_NUMBER)); // 2031 : productIdx는 숫자만 입력이 가능합니다.
    
    const checkProductIdx = await productProvider.productIdxCheck(productIdx);

    if (checkProductIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.PRODUCTIDX_NOT_EXIST)) // 2026 : 존재하지 않는 상품입니다.

    // Brand Name
    const storeName = await productProvider.storeName(productIdx);

    // Coupon Result
    const productCouponResult = await productProvider.productCoupon(productIdx, userIdx);
    
    var result = []
    result[0] = storeName[0];
    result[0]["couponList"] = productCouponResult;

    result[0].couponList[0]["status"] = 'N'
    console.log(result[0].couponIdx);
    for (var i = 0; i < result[0].couponList.length; i++) {
        var couponIdx = result[0].couponList[i].couponIdx;
        var have = await productProvider.haveFlag(couponIdx, userIdx);

        if (have[0].exist === 0)
            result[0].couponList[i]["status"] = 'N'
        else 
            result[0].couponList[i]["status"] = 'Y'
    }

    return res.send(response(baseResponse.SUCCESS, result));
 }
 
/**
 * API No. 24
 * API Name : 상품별 쿠폰 등록 API
 * [POST] /products/:productIdx/coupon
 */
exports.postProductCoupon = async function(req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {productIdx} = req.params;

    // Request Query Stirng
    const {number} = req.query;

    // Request Body
    const bodyIdx = req.body;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(productIdx) && productIdx < 1)
        return res.send(response(baseResponse.PRODUCTIDX_ONLY_NUMBER)); // 2031 : productIdx는 숫자만 입력이 가능합니다.
    
    const checkProductIdx = await productProvider.productIdxCheck(productIdx);

    if (checkProductIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.PRODUCTIDX_NOT_EXIST)) // 2026 : 존재하지 않는 상품입니다.

    // Coupon Result
    const productCouponResult = await productProvider.productCoupon(productIdx, userIdx);
    console.log(productCouponResult);
    if (productCouponResult[0].couponIdx === null)
        return res.send(errResponse(baseResponse.COUPON_NOT_EXIST)) // 2047 : 존재하는 쿠폰이 없습니다.
    if (number == 0) {
        for (var i = 0; i < productCouponResult.length; i++) {
            var couponIdx = productCouponResult[i].couponIdx;
            var have = await productProvider.haveFlag(couponIdx, userIdx);

            if (have[0].exist === 0)
                await productService.productCoupon(couponIdx, userIdx);
            else 
                continue;
        }
    }
    else if (number <= productCouponResult.length) {
        var couponIdx = productCouponResult[number - 1].couponIdx;
        var have = await productProvider.haveFlag(couponIdx, userIdx);
        if (have[0].exist === 0)
            await productService.productCoupon(couponIdx, userIdx);

        else 
            return res.send(errResponse(baseResponse.COUPONIDX_EXIST)) // 2036 : 해당 쿠폰이 이미 존재합니다.
    }
    else
        return res.send(errResponse(baseResponse.NUMBER_ERROR_TYPE)) // 2037 : number 번호를 확인해주세요.

    return res.send(response(baseResponse.SUCCESS));
 }

 /**
 * API No. 25
 * API Name : 카테고리별 스토어 상품 조회 API
 * [GET] /products/:productIdx
 */

exports.getProductCategoryStore = async function(req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size, storeIdx} = req.query;

    // Request Path Variable
    const {categoryIdx} = req.params;
    
    // Request Body
    const bodyIdx = req.body;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) && page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) && size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.
    
    if (!storeIdx)
        return res.send(response(baseResponse.STOREIDX_EMPTY)); // 2028 : storeIdx를 입력해주세요.

    if (!regNum.test(storeIdx) && storeIdx < 1)
        return res.send(response(baseResponse.STOREIDX_ONLY_NUMBER)); // 2030 : storeIdx는 숫자만 입력이 가능합니다.

    const checkStoreIdx = await productProvider.storeCheck(storeIdx);

    if (checkStoreIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.STOREIDX_NOT_EXIST)) // 2029 : 존재하지 않는 쇼핑몰입니다.

    // Category Filtering
    if (categoryIdx) {
        if (categoryIdx > 1 && categoryIdx < 13)
        {
            large = parseInt(categoryIdx) + 1
            const categoryIdxRow = await productProvider.categoryIdx(categoryIdx);
            const first = categoryIdxRow[1].categoryIdx;
            const last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and c.categoryRef between ' + first + ' and ' + last;
        }
        else 
            return res.send(errResponse(baseResponse.CATEGORYIDX_ERROR_TYPE)); // 2027 : categoryIdx 번호를 확인해주세요.
    }
    else
        return res.send(errResponse(baseResponse.CATEGORYIDX_ERROR_TYPE)); // 2027 : categoryIdx 번호를 확인해주세요.

    page = size * (page-1);

    // Category Store Result
    let categoryStoreProduct = await productProvider.categoryProduct(condition, storeIdx, page, size);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Category Name Result
    let categoryName = await productProvider.categoryName(categoryIdx);


    // Category Store Result <- Status
    for (var i = 0; i < categoryStoreProduct.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (categoryStoreProduct[i].productIdx === getLikeProductStatus[j].productIdx) {
                categoryStoreProduct[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // New Product Result 'N' Insert
        if (flag === 0)
            categoryStoreProduct[i]["likeProductStatus"] = 'N';
    }
    
    var title;
    // Title Result
    if (categoryStoreProduct.length > 0)
        title = categoryName[0].categoryName + ' / ' + categoryStoreProduct[0].storeName;
    return res.send(response(baseResponse.SUCCESS, {title, categoryStoreProduct}));

 }

 /**
 * API No. 26
 * API Name : 상품 정보 조회 API
 * [GET] /products/:productIdx/info
 */

exports.getProductInfo = async function(req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {productIdx} = req.params;

    // Request Body
    const bodyIdx = req.body;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.
    
    if (!regNum.test(productIdx) && productIdx < 1)
        return res.send(response(baseResponse.STOREIDX_ONLY_NUMBER)); // 2031 : productIdx는 숫자만 입력이 가능합니다.
    
    const checkProductIdx = await productProvider.productIdxCheck(productIdx);

    if (checkProductIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.PRODUCTIDX_NOT_EXIST)) // 2026 : 존재하지 않는 상품입니다.
    

    // Info Result
    let productInfoResult = await productProvider.productInfo(productIdx);
    let sizeName = productInfoResult[0].sizeName;
    let colorName = productInfoResult[0].colorName;

    for (var i = 1; i < productInfoResult.length; i++) {
        var flag = 0
        for (var j = 0; j < i; j++) {
            if (productInfoResult[i].sizeName === productInfoResult[j].sizeName) {
                flag = 1;
                break;
            }
        }
        if (flag === 0)
            sizeName += ', ' + productInfoResult[i].sizeName;
        else
            continue 
    }

    for (var i = 1; i < productInfoResult.length; i++) {
        var flag = 0
        for (var j = 0; j < i; j++) {
            if (productInfoResult[i].colorName === productInfoResult[j].colorName) {
                flag = 1;
                break;
            }
        }
        if (flag === 0)
            colorName += ', ' + productInfoResult[i].colorName;
        else
            continue 
    }

    productInfoResult[0].colorName = colorName;
    productInfoResult[0].sizeName = sizeName;


    return res.send(response(baseResponse.SUCCESS, productInfoResult[0]));
}

/**
 * API No. 27
 * API Name : 스토어별 추천 상품 조회 API
 * [GET] /products/:storeIdx/recommendation
 */
exports.getProductRecommendation = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    let {storeIdx} = req.params;
    
    // Request Body
    const bodyIdx = req.body;
    
    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.
        
    if (!storeIdx)
        return res.send(response(baseResponse.STOREIDX_EMPTY)); // 2028 : storeIdx를 입력해주세요.

    if (!regNum.test(storeIdx) && storeIdx < 1)
        return res.send(response(baseResponse.STOREIDX_ONLY_NUMBER)); // 2030 : storeIdx는 숫자만 입력이 가능합니다.

    const checkStoreIdx = await productProvider.storeCheck(storeIdx);

    if (checkStoreIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.STOREIDX_NOT_EXIST)) // 2029 : 존재하지 않는 쇼핑몰입니다.



    // Recommendation Product Result
    let recommendationProductResult = await productProvider.recommendationProduct(storeIdx);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Home Product Result <- Status
    for (var i = 0; i < recommendationProductResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (recommendationProductResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                recommendationProductResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Home Product Result 'N' Insert
        if (flag === 0)
            recommendationProductResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, recommendationProductResult));

 }


/**
 * API No. 30
 * API Name : 찜 상품 수정 API
 * [PATCH] /products/:productIdx/like
 */
exports.patchLike = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {productIdx} = req.params
    
    // Request Body
    const bodyIdx = req.body;

    // Request Query String
    const {status} = req.query;
    
    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);
    
    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(productIdx) && productIdx < 1)
        return res.send(response(baseResponse.PRODUCTIDX_ONLY_NUMBER)); // 2031 : productIdx는 숫자만 입력이 가능합니다.

    const checkProductIdx = await productProvider.productIdxCheck(productIdx);
    
    if (checkProductIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.PRODUCTIDX_NOT_EXIST)) // 2026 : 존재하지 않는 상품입니다.

    if (!status)
        return res.send(errResponse(baseResponse.STATUS_EMPTY)); // 2032 : status 값을 입력해주세요.
    
    if (status !== 'N' && status != 'Y')
        return res.send(errResponse(baseResponse.STATUS_ERROR_TYPE)); // 2033 : status Y또는 N을 입력해주세요.
    
    const checkLikeStatus = await productProvider.likeCheck(productIdx, userIdx);

    // 없으면 생성
    if (checkLikeStatus[0].exist === 0)
        await productService.insertLike(productIdx, userIdx);

    // 있으면 상태만 업데이트
    else
        await productService.updateLike(productIdx, userIdx, status);
    
    return res.send(response(baseResponse.SUCCESS));

 }

 /**
 * API No. 31
 * API Name : 북마크 스토어 신상품 조회 API
 * [GET] /products/book-mark/store
 */
exports.getBookmarkProduct = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size} = req.query;
    
    // Request Body
    const bodyIdx = req.body;
    
    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) || page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) && size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.

    page = size * (page-1);

    // Bookmark Product Result
    const productListResult = await productProvider.bookmarkNewProduct(userIdx, page, size);

    
    return res.send(response(baseResponse.SUCCESS, productListResult));

}


/**
 * API No. 38
 * API Name : 상품 컬러 조회 API
 * [GET] /products/:productIdx/color
 */
exports.getProductOption = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {productIdx} = req.params;
    
    // Request Body
    const bodyIdx = req.body;
    
    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!productIdx)
        return res.send(errResponse(baseResponse.PRODUCTIDX_NOT_EXIST)); // 2048 : productIdx값을 입력해주세요.

    if (regNum.test(productIdx) && productIdx < 1)
        return res.send(errResponse(baseResponse.PRODUCTIDX_ONLY_NUMBER)); // 2031 : productIdx는 숫자만 입력이 가능합니다.
    
    const checkProductIdx = await productProvider.productIdxCheck(productIdx);

    if (checkProductIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.PRODUCTIDX_NOT_EXIST)); // 2026 : 존재하지 않는 상품입니다.

    // Option Result
    const colorResult = await productProvider.option(productIdx);

    
    return res.send(response(baseResponse.SUCCESS, colorResult));

}


/**
 * API No. 29
 * API Name : 상품 사이즈 조회 API
 * [GET] /products/:productIdx/option
 */
exports.getProductSize = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Reqeust Path Variable
    const {productIdx} = req.params;

    // Request Query String
    const {colorIdx} = req.query;
    
    // Request Body
    const bodyIdx = req.body;
    
    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!productIdx)
        return res.send(errResponse(baseResponse.PRODUCTIDX_NOT_EXIST)); // 2048 : productIdx값을 입력해주세요.

    if (regNum.test(productIdx) && productIdx < 1)
        return res.send(errResponse(baseResponse.PRODUCTIDX_ONLY_NUMBER)); // 2031 : productIdx는 숫자만 입력이 가능합니다.
    
    const checkProductIdx = await productProvider.productIdxCheck(productIdx);

    if (checkProductIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.PRODUCTIDX_NOT_EXIST)); // 2026 : 존재하지 않는 상품입니다.

    if (!colorIdx)
        return res.send(errResponse(baseResponse.COLORIDX_EMPTY)) // 2049 : colorIdx 값을 입력해주세요.

    if (regNum.test(colorIdx) && colorIdx < 1)
        return res.send(errResponse(baseResponse.COLORIDX_ONLY_NUMBER)); // 2050 : colorIdx는 숫자만 입력해주세요.

    const checkColorIdx = await productProvider.colorIdxCheck(productIdx, colorIdx);
    
    if (checkColorIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.COUPONIDX_EXIST)); // 2051 : 해당 컬러가 존재하지 않습니다.
    
    // Size Result
    const sizeResult = await productProvider.size(productIdx, colorIdx);

    
    return res.send(response(baseResponse.SUCCESS, sizeResult));

}

/**
 * API No. 32
 * API Name : 카테고리별 상품 조회 API
 * [GET] /products/category
 */
exports.
getCategoryProduct = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size, large, medium, small, deliveryFilter, originalFilter} = req.query;
    
    let categoryCondition = ''
    let deliveryCondition = ''
    let originalCondition = 'order by '

    // Request Body
    const {bodyIdx} = req.body;
    
    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) && page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) && size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.
    page = size * (page-1);

    if (large) {
        large = parseInt(large) + 1
         var categoryIdxRow = await productProvider.categoryIdx(large);
        let first = categoryIdxRow[1].categoryIdx;
        let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

        if (large && !medium && !small)
            categoryCondition += 'and categoryRef between ' + first + ' and ' + last;
        else if (large && medium && !small)
            categoryCondition += 'and categoryRef = ' + medium
        else if (large && medium && small)
            categoryCondition += 'and c.categoryIdx = ' + small
    }
    else 
        categoryCondition = ''

    if (deliveryFilter == 1)
        deliveryCondition += 'and s.deliveryPrice = 0'
    else
        deliveryCondition = ''
    
    switch(originalFilter) {
        case '1' : originalCondition += 'ifnull(reviewCount, 0) DESC'; break;
        case '2' : originalCondition += 'p.createdAt ASC'; break;
        case '3' : originalCondition += 'productPrice * ((100 - productSale) / 100) ASC'; break;
        case '4' : originalCondition += 'productPrice * ((100 - productSale) / 100) DESC'; break;
        default : originalCondition += 'ifnull(readCount, 0) + ifnull(sum(pb.productNum), 0) DESC'; break;
    } 
    
    // Search Product Result
    const categoryProductResult = await productProvider.cateProduct(userIdx, categoryCondition, deliveryCondition, originalCondition, page, size);

    
    return res.send(response(baseResponse.SUCCESS, categoryProductResult));

}