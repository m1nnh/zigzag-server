module.exports = function(app){
    const brand = require('./brandController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No. 33 브랜드 인트로 조회 API
    app.get('/brands/:brandIdx/intro', jwtMiddleware, brand.getBrandIntro);

    // API No. 34 브랜드 쿠폰 리스트 조회 API 
    app.get('/brands/:brandIdx/coupon-list', jwtMiddleware, brand.getBrandCoupon);

    // API No. 35 브랜드 쿠폰 등록 API
    app.post('/brands/:brandIdx/coupon', jwtMiddleware, brand.postBrandCoupon);

    // API No. 36 브랜드 북마크 수정 API
    app.patch('/brands/:brandIdx/book-mark', jwtMiddleware, brand.patchBrandBookmark);

    // API No. 37 브랜드 토탈 랭킹 조회 API
    app.get('/brands/total-rank', jwtMiddleware, brand.getTotalRank);

    // API No. 38 신규 입점 브랜드 조회 API (30일 기준)
    app.get('/brands/new', jwtMiddleware, brand.getBrandNew);

};