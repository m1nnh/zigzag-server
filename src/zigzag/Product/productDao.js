// userIdx Check
async function selectUserIdx(connection, userIdx) {
  const userIdxQuery = `
    select exists(select userIdx from User where userIdx = ? and status = 'N') as exist;
     `;
  const [userIdxRow] = await connection.query(userIdxQuery, userIdx);
  return userIdxRow;
}

// productIdx Check
async function selectProductIdx(connection, productIdx) {
  const productIdxQuery = `
    select exists(select productIdx from Product where productIdx = ? and status = 'N') as exist;
     `;
  const [productIdxRow] = await connection.query(productIdxQuery, productIdx);
  return productIdxRow;
}

// storeIdx Check
async function selectStoreIdx(connection, storeIdx) {
  const storeIdxQuery = `
    select exists(select storeIdx from Store where storeIdx = ? and status = 'N') as exist;
     `;
  const [storeIdxRow] = await connection.query(storeIdxQuery, storeIdx);
  return storeIdxRow;
}

// brandIdx Check
async function selectBrandIdx(connection, brandIdx) {
  const brandIdxQuery = `
    select exists(select brandIdx from Brand where brandIdx = ? and status = 'N') as exist;
     `;
  const [brandIdxRow] = await connection.query(brandIdxQuery, brandIdx);
  return brandIdxRow;
}

// ReviewIdx Check
async function selectReviewIdx(connection, reviewIdx) {
  const reviewIdxQuery = `
    select exists(select reviewIdx from Review where reviewIdx = ? and status = 'N') as exist;
     `;
  const [reviewIdxRow] = await connection.query(reviewIdxQuery, reviewIdx);
  return reviewIdxRow;
}

// likeFlag Check
async function selectLikeReviewStatus(connection, [reviewIdx, userIdx]) {
  const likeQuery = `
  select exists(select reviewIdx from LikeFlagReview lfr left join User u on lfr.userIdx = u.userIdx where lfr.reviewIdx = ? and lfr.userIdx = ?) as exist;
     `;
  const [likeRow] = await connection.query(likeQuery, [reviewIdx, userIdx]);
  return likeRow;
}

// likeFlag Status  Check
async function selectLikeFlagStatus(connection, [reviewIdx, userIdx]) {
  const likeQuery = `
  select status from LikeFlagReview where reviewIdx = ? and userIdx = ?;
     `;
  const [likeRow] = await connection.query(likeQuery, [reviewIdx, userIdx]);
  return likeRow;
}


// like Check
async function selectLikeStatus(connection, [productIdx, userIdx]) {
  const likeQuery = `
  select exists(select productIdx from LikeProduct lp left join User u on lp.userIdx = u.userIdx where lp.productIdx = ? and lp.userIdx = ?) as exist;
     `;
  const [likeRow] = await connection.query(likeQuery, [productIdx, userIdx]);
  return likeRow;
}

// Store Bookmark Check
async function selectStoreBookmarkStatus(connection, [storeIdx, userIdx]) {
  const bookmarkQuery = `
  select exists(select storeIdx from Bookmark b left join User u on b.userIdx = u.userIdx where b.storeIdx = ? and b.userIdx = ?) as exist;
     `;
  const [bookmarkRow] = await connection.query(bookmarkQuery, [storeIdx, userIdx]);
  return bookmarkRow;
}

// Brand Bookmark Check
async function selectBrandBookmarkStatus(connection, [brandIdx, userIdx]) {
  const bookmarkQuery = `
  select exists(select brandIdx from Bookmark b left join User u on b.userIdx = u.userIdx where b.brandIdx = ? and b.userIdx = ?) as exist;
     `;
  const [bookmarkRow] = await connection.query(bookmarkQuery, [brandIdx, userIdx]);
  return bookmarkRow;
}



// Get Home Product
async function selectHomeProduct(connection, [page, size]) {

  const homeProductQuery = `
  select p.storeIdx,
      p.productIdx,
      thumbnailUrl,
      zFlag,
      s.storeName,
      productContents,
      case
      when productSale > 0 and zSaleFlag = 'Y'
          then '제트할인가'
      else '' end                                       as zSaleStatus,
      case
      when productSale > 0 and zSaleFlag = 'Y'
          then format(productPrice, 0)
      else
          '' end                                        as originPrice,
      case
      when productSale > 0
          then concat(productSale, '%')
      else '' end                                       as salePercentage,
      format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
      case
        when s.deliveryPrice = 0
              then '무료배송'
          else
                  '' end as deliveryPrice,
                  case
           when p.brandIdx is null
               then ''
           else
               '브랜드' end                   as brandStatus
    from Product p
        left join Store s on s.storeIdx = p.storeIdx
    where p.status= 'N'
    order by rand()
    limit ` + page + `, ` + size + `;
    `;
  const [homeProductRow] = await connection.query(homeProductQuery, [page, size]);
  
  return homeProductRow;
}

// Get Home Slide Product
async function selectHomeSlideProduct(connection) {

  const homeSlideProductQuery = `
    select p.storeIdx,
       p.productIdx,
       thumbnailUrl,
       zFlag,
       s.storeName,
       productContents,
       case
       when productSale > 0 and zSaleFlag = 'Y'
           then '제트할인가'
       else '' end                                       as zSaleStatus,
       case
       when productSale > 0 and zSaleFlag = 'Y'
           then format(productPrice, 0)
       else
           '' end                                        as originPrice,
       case
       when productSale > 0
           then concat(productSale, '%')
       else '' end                                       as salePercentage,
       format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
       case
           when s.deliveryPrice = 0
               then '무료배송'
           else
               '' end                      as deliveryPrice,
       case
           when p.brandIdx is null
               then ''
           else
               '브랜드' end                   as brandStatus
  from Product p
         left join Store s on s.storeIdx = p.storeIdx
  where p.status = 'N'
  order by rand()
  limit 15;
    `;
  const [homeSlideProductRow] = await connection.query(homeSlideProductQuery);
  
  return homeSlideProductRow;
}

// Get Like Product Status
async function selectLikeProductStatus(connection, userIdx) {

  const likeProductStatusQuery = `
    select lp.productIdx, lp.status
    from Product p
    left join LikeProduct lp on lp.productIdx = p.productIdx
    where lp.userIdx = ?;
  
    `;
  const [likeProductStatusRow] = await connection.query(likeProductStatusQuery, userIdx);
  
  return likeProductStatusRow;
}

// Get Brand Product
async function selectBrandProduct(connection, [page, size, brandIdx]) {

  const brandProductQuery = `
    select p.storeIdx,
       p.productIdx,
       p.brandIdx,
       thumbnailUrl,
       zFlag,
       b.brandName,
       productContents,
       case
       when productSale > 0 and zSaleFlag = 'Y'
           then '제트할인가'
       else '' end                                       as zSaleStatus,
       case
       when productSale > 0 and zSaleFlag = 'Y'
           then format(productPrice, 0)
       else
           '' end                                        as originPrice,
       case
       when productSale > 0
           then concat(productSale, '%')
       else '' end                                       as salePercentage,
       format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
       case
           when s.deliveryPrice = 0
               then '무료배송'
           else
               '' end                      as deliveryPrice

  from Product p
         left join Store s on s.storeIdx = p.storeIdx
         left join LikeProduct lp on lp.productIdx = p.productIdx
         left join Brand b on b.brandIdx = p.brandIdx
  where p.brandIdx = ? and p.status = 'N'
  order by rand()
  limit ` + page + `, ` + size + `;
  `;
    
  const [brandProductRow] = await connection.query(brandProductQuery, [brandIdx, page, size]);
  
  return brandProductRow;
}

// Get CategoryIdx
async function selectCategoryIdx(connection, num) {

  const categoryIdxQuery = `
    select categoryIdx from Category where categoryRef = ` + num + ``;
  const [categoryIdxRow] = await connection.query(categoryIdxQuery, num);
  
  return categoryIdxRow;
}

// Get Brand Rank
async function selectBrandRank(connection, condition) {

  const brandRankQuery = `
    select b.brandIdx, b.brandUrl, b.brandName
    from Brand b
            left join Product p on p.brandIdx = b.brandIdx
            left join ReadCount rc on rc.productIdx = p.productIdx
            left join Category c on p.categoryIdx = c.categoryIdx
    where b.status = 'N' `+ condition +`
    group by brandIdx
    order by ifnull(count(rc.productIdx),0) DESC
    limit 3;
  `;
    
  const [brandRankRow] = await connection.query(brandRankQuery, condition);

  return brandRankRow;
}

// Get Brand TotalRank
async function selectBrandTotalRank(connection, [page, size, condition]) {

  const brandRankQuery = `
    select b.brandIdx, b.brandUrl, b.brandName
    from Brand b
            left join Product p on p.brandIdx = b.brandIdx
            left join ReadCount rc on rc.productIdx = p.productIdx
            left join Category c on p.categoryIdx = c.categoryIdx
    where b.status = 'N' `+ condition +`
    group by brandIdx
    order by ifnull(count(rc.productIdx),0) DESC
    limit ` + page + `, ` + size + `;
  `;
    
  const [brandRankRow] = await connection.query(brandRankQuery, [page, size, condition]);

  return brandRankRow;
}


// Get BookMark Brand Status
async function selectBookMarkStatus(connection, userIdx) {

  const bookMarkStatusQuery = `
    select b.brandIdx, bm.status
    from Brand b
    left join Bookmark bm on bm.brandIdx = b.brandIdx
    where bm.userIdx = ?;
  
    `;
  const [bookMarkStatusRow] = await connection.query(bookMarkStatusQuery, userIdx);
  
  return bookMarkStatusRow;
}

// Get Rank Brand Product
async function selectRankBrandProduct(connection, brandIdx) {

  const brandProductQuery = `select s.storeIdx, p.productIdx, p.ThumbnailUrl
  from Brand b
  left join Product p on p.brandIdx = b.brandIdx
  left join Store s on s.storeIdx = p.storeIdx
  where b.brandIdx = ? and p.status = 'N'
  limit 20`;

    
  const [brandProductRow] = await connection.query(brandProductQuery, brandIdx);
  
  return brandProductRow;
}

// Get Brand Intro 
async function selectBrandIntro(connection, [brandIdx, userIdx]) {

  const brandIntroQuery = `
  select b.brandIdx,
  brandUrl,
  brandName,
  ifnull(bookmarkCount, 0) as bookmarkCount,
  ifnull((select case
              when bm.status is null
                  then 'N'
              else
                  bm.status end as status
   from Bookmark bm
            left join User u on u.userIdx = bm.userIdx
   where u.userIdx = ?
     and bm.brandIdx = ?), 'N')                                         as bookmarkStatus,
  concat('모두 ', mainCategoryName)                                 as mainCategoryName,
  case
      when maxCouponPrice is null
          then ''
      else
          concat('최대 ', format(maxCouponPrice, 0), '원 할인 쿠폰') end as maxCouponPrice,
  concat(ifnull(v.reviewCount, 0), '개')                           as reviewCount,
  ifnull(v.score, 0)                                              as score,
  case
      when s.freeDeliveryStd = 0
          then '전 상품 무료'
      else
          concat(format(s.freeDeliveryStd, 0), '원 이상 무료') end     as delivery
from Brand b
    left join Product p on b.brandIdx = p.brandIdx
    left join (select ifnull(count(bm.brandIdx), 0) as bookmarkCount, bm.brandIdx
               from Bookmark bm
               group by bm.brandIdx) as x on b.brandIdx = x.brandIdx
    left join (select max(c.couponPrice) as maxCouponPrice, c.brandIdx, c.status
               from Coupon c where c.brandIdx = ? and c.status = 'N') as w on w.brandIdx = p.brandIdx
    left join (select ifnull(count(r.reviewIdx), 0)               as reviewCount,
                      round(sum(r.score) / count(r.reviewIdx), 1) as score,
                      productIdx
               from Review r
               group by r.productIdx) as v on v.productIdx = p.productIdx
    left join Store s on p.storeIdx = s.storeIdx
where b.brandIdx = ?
group by b.brandIdx; `;

    
  const [brandIntroRow] = await connection.query(brandIntroQuery, [userIdx, brandIdx, brandIdx, brandIdx]);
  
  return brandIntroRow;
}

// Get Week Best Product
async function selectWeekBestProduct(connection, brandIdx) {

  const weekBestProductQuery = `
    select p.storeIdx,
    p.productIdx,
    thumbnailUrl,
    case
        when timestampdiff(day, p.createdAt, CURRENT_TIMESTAMP()) < 7
            then 'Y'
        else
            'N' end as newFlag,
    b.brandName,
    productContents,
    case
    when productSale > 0 and zSaleFlag = 'Y'
        then '제트할인가'
    else '' end                                       as zSaleStatus,
    case
    when productSale > 0 and zSaleFlag = 'Y'
        then format(productPrice, 0)
    else
        '' end                                        as originPrice,
    case
    when productSale > 0
        then concat(productSale, '%')
    else '' end                                       as salePercentage,
    format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
    case
        when s.deliveryPrice = 0
            then '무료배송'
        else
            '' end                      as deliveryPrice

  from Brand b
  left join Product p on p.brandIdx = b.brandIdx
  left join Store s on p.storeIdx = s.storeIdx
  left join ProductDetail pd on pd.productIdx = p.productIdx
  left join ProductBasket pb on pb.productDetailIdx = pd.productDetailIdx
  left join Basket bs on bs.basketIdx = pb.basketIdx
  left join OrderProduct op on op.basketIdx = bs.basketIdx
  where op.confirm = 'Y' and b.brandIdx = ?
  group by p.productIdx
  order by sum(pb.productNum) DESC
  limit 10;
    `;
  const [weekBestProductRow] = await connection.query(weekBestProductQuery, brandIdx);
  
  return weekBestProductRow;
}

// Get CategoryIdx, CategoryName
async function selectCategoryList(connection, brandIdx) {

  const categoryListQuery = `
  select c.categoryIdx, c.categoryName
  from Brand b
  left join Product p on p.brandIdx = b.brandIdx
  left join Category c on p.categoryIdx = c.categoryIdx
  where b.brandIdx = ?
  group by categoryIdx;
    `;
  const [categoryListRow] = await connection.query(categoryListQuery, brandIdx);
  
  return categoryListRow;
}

// Get Brand Category Product
async function selectBrandCategoryProduct(connection, [page, size, category, condition, brandIdx]) {

  const resultQuery = `
    select p.storeIdx,
    p.productIdx,
    thumbnailUrl,
    case
        when timestampdiff(day, p.createdAt, CURRENT_TIMESTAMP()) < 7
            then 'Y'
        else
            'N' end as newFlag,
    b.brandName,
    productContents,
    case
    when productSale > 0 and zSaleFlag = 'Y'
        then '제트할인가'
    else '' end                                       as zSaleStatus,
    case
    when productSale > 0 and zSaleFlag = 'Y'
        then format(productPrice, 0)
    else
        '' end                                        as originPrice,
    case
    when productSale > 0
        then concat(productSale, '%')
    else '' end                                       as salePercentage,
    format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
    case
        when s.deliveryPrice = 0
            then '무료배송'
        else
            '' end                      as deliveryPrice
    from Brand b
    left join Product p on p.brandIdx = b.brandIdx
    left join Store s on p.storeIdx = s.storeIdx
    left join ProductDetail pd on pd.productIdx = p.productIdx
    left join ProductBasket pb on pb.productDetailIdx = pd.productDetailIdx
    left join Basket bs on bs.basketIdx = pb.basketIdx
    left join OrderProduct op on op.basketIdx = bs.basketIdx
    left join (select count(rc.productIdx) as readCount, productIdx from ReadCount rc group by productIdx) as v on v.productIdx=p.productIdx
    left join (select ifnull(count(r.reviewIdx), 0)               as reviewCount,
                          productIdx
                  from Review r
                  group by r.productIdx) as w on w.productIdx = p.productIdx
    left join Category c on c.categoryIdx = p.categoryIdx
    where b.brandIdx = ? and p.status = 'N' and op.confirm = 'Y' ` + category + `
    group by p.productIdx
    ` + condition + `
    limit ` + page + `, ` + size + `;
    `;
  const [resultRow] = await connection.query(resultQuery, [brandIdx, category, condition, page, size]);
  
  return resultRow;
}

// Get Brand Copun List
async function selectBrandCoupon(connection, [brandIdx, userIdx]) {

  const couponListQuery = `
    select c.couponIdx, concat(format(c.couponPrice, 0), '원') as couponPrice, c.couponName,
    case
      when c.couponMin = 0
       then '전 상품 가격 상관 없이 사용 가능'
    else
       concat('총 상품', format(c.couponMin, 0), '원 이상 구매 시 사용 가능') end as minPrice
  from Brand b
  left join Coupon c on c.brandIdx = b.brandIdx
  where b.brandIdx = ? and c.status = 'N';
    `;
  const [couponListRow] = await connection.query(couponListQuery, [brandIdx]);
  
  return couponListRow;
}

// Get Brand Name
async function selectBrandName(connection, brandIdx) {

  const brandNameQuery = `
  select concat(brandName, ' 쿠폰') as brandName
  from Brand
  where brandIdx = ?;
    `;
  const [brandNameRow] = await connection.query(brandNameQuery, brandIdx);
  
  return brandNameRow;
}


// HaveFlag Check
async function haveFlag(connection, [couponIdx, userIdx]) {

  const haveFlagQuery = `
  select exists (select cu.couponIdx from Coupon c right join CouponUser cu on c.couponIdx = cu.couponIdx
    where cu.userIdx = ? and cu.couponIdx = ?)  as exist;
     `;
  const [flagRow] = await connection.query(haveFlagQuery, [userIdx, couponIdx]);
  
  return flagRow;
}

// Insert Brand Coupon
async function insertBrandCoupon(connection, [couponIdx, userIdx]) {
  const insertCouponQuery = `
    insert into CouponUser(couponIdx, userIdx)
    values (?, ?);
    `;
  const [insertCouponRow] = await connection.query(insertCouponQuery, [couponIdx, userIdx]);

  return insertCouponRow;
}

// Get Best Product
async function selectBestProduct(connection, [page, size, condition, agecondition]) {

  const bestProductQuery = `
    select p.storeIdx,
    p.productIdx,
    thumbnailUrl,
    zFlag,
    s.storeName,
    productContents,
    case
    when productSale > 0 and zSaleFlag = 'Y'
        then '제트할인가'
    else '' end                                       as zSaleStatus,
    case
    when productSale > 0 and zSaleFlag = 'Y'
        then format(productPrice, 0)
    else
        '' end                                        as originPrice,
    case
    when productSale > 0
        then concat(productSale, '%')
    else '' end                                       as salePercentage,
    format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
    case
        when s.deliveryPrice = 0
            then '무료배송'
        else
            '' end                      as deliveryPrice
  from Product p
      left join Store s on s.storeIdx = p.storeIdx
          left join Category c on c.categoryIdx = p.categoryIdx
      left join (select ifnull(count(rc.productIdx), 0) as readCount, rc.productIdx, rc.userIdx

                        from ReadCount rc
                group by rc.productIdx) as v on v.productIdx = p.productIdx
      left join User u on v.userIdx = u.userIdx
  ` + condition + ` `+ agecondition +`
  group by p.productIdx
  order by readCount DESC
  limit ` + page + `, ` + size + `;
  `;

  const [bestProductRow] = await connection.query(bestProductQuery, [page, size, condition, agecondition]);
  
  return bestProductRow;
}



// Get Time Sale Product
async function selectTimeSaleProduct(connection, [page, size]) {

  const timeSaleProductQuery = `
    select p.storeIdx,
       p.productIdx,
       thumbnailUrl,
       zFlag,
       s.storeName,
       p.productContents,
       case
       when productSale > 0 and zSaleFlag = 'Y'
           then '제트할인가'
       else '' end                                       as zSaleStatus,
       case
       when productSale > 0 and zSaleFlag = 'Y'
           then format(productPrice, 0)
       else
           '' end                                        as originPrice,
       case
       when productSale > 0
           then concat(productSale, '%')
       else '' end                                       as salePercentage,
       format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
       case
           when s.deliveryPrice = 0
               then '무료배송'
           else
               '' end                      as deliveryPrice,
       case
           when p.brandIdx is null
               then ''
           else
               '브랜드' end                   as brandStatus
    from Product p
         left join Store s on s.storeIdx = p.storeIdx
    where p.timeSale = 'Y' and p.status = 'N'
    limit ` + page + `, ` + size + `;
    `;
  const [timeSaleProductRow] = await connection.query(timeSaleProductQuery, [page, size]);
  
  return timeSaleProductRow;
}


// Get Benefit Product
async function selectBenefitProduct(connection, categoryRef) {

  const saleProductQuery = `
    select p.storeIdx,
        p.productIdx,
        c.categoryRef,
        thumbnailUrl,
        zFlag,
        s.storeName,
        p.productContents,
        case
        when productSale > 0 and zSaleFlag = 'Y'
            then '제트할인가'
        else '' end                                       as zSaleStatus,
        case
        when productSale > 0 and zSaleFlag = 'Y'
            then format(productPrice, 0)
        else
            '' end                                        as originPrice,
        case
        when productSale > 0
            then concat(productSale, '%')
        else '' end                                       as salePercentage,
        format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
        case
            when s.deliveryPrice = 0
                then '무료배송'
            else
                '' end                      as deliveryPrice,
        case
            when p.brandIdx is null
                then ''
            else
                '브랜드' end                   as brandStatus
    from Product p
          left join Store s on s.storeIdx = p.storeIdx
          left join Category c on c.categoryIdx = p.categoryIdx
    where p.productSale != 0 and p.status = 'N' and c.categoryRef = ?
    order by p.productSale DESC
    limit 10;`;
  const [saleProductRow] = await connection.query(saleProductQuery, categoryRef);
  
  return saleProductRow;
}


// Get Sale Product
async function selectSaleProduct(connection, [condition, page, size, categoryRef]) {
  const saleProductQuery = `
    select (select categoryName from Category where categoryIdx = ?) as categoryName, p.storeIdx,
        p.productIdx,
        thumbnailUrl,
        zFlag,
        s.storeName,
        p.productContents,
        case
        when productSale > 0 and zSaleFlag = 'Y'
            then '제트할인가'
        else '' end                                       as zSaleStatus,
        case
        when productSale > 0 and zSaleFlag = 'Y'
            then format(productPrice, 0)
        else
            '' end                                        as originPrice,
        case
        when productSale > 0
            then concat(productSale, '%')
        else '' end                                       as salePercentage,
        format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
        case
            when s.deliveryPrice = 0
                then '무료배송'
            else
                '' end                      as deliveryPrice,
        case
            when p.brandIdx is null
                then ''
            else
                '브랜드' end                   as brandStatus
    from Product p
          left join Store s on s.storeIdx = p.storeIdx
          left join Category c on c.categoryIdx = p.categoryIdx
    where p.productSale != 0 and p.status = 'N' ` + condition + `
    order by p.productSale DESC
    limit ` + page + `, ` + size + `;`;
  const [saleProductRow] = await connection.query(saleProductQuery, [categoryRef, condition, page, size]);
  
  return saleProductRow;
}

// Get New Sale Product
async function selectSaleNewProduct(connection, [page, size, condition]) {
  
  const newSaleProductQuery = `
    select p.storeIdx,
        p.productIdx,
        thumbnailUrl,
        zFlag,
        s.storeName,
        productContents,
        case
        when productSale > 0 and zSaleFlag = 'Y'
            then '제트할인가'
        else '' end                                       as zSaleStatus,
        case
        when productSale > 0 and zSaleFlag = 'Y'
            then format(productPrice, 0)
        else
            '' end                                        as originPrice,
        case
        when productSale > 0
            then concat(productSale, '%')
        else '' end                                       as salePercentage,
        format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
        case
            when s.deliveryPrice = 0
                then '무료배송'
            else
                '' end                      as deliveryPrice,
        case
            when p.brandIdx is null
                then ''
            else
                '브랜드' end                   as brandStatus
  from Product p
          left join Store s on s.storeIdx = p.storeIdx
          left join Category c on c.categoryIdx = p.categoryIdx
  where timestampdiff(day, p.createdAt, CURRENT_TIMESTAMP()) < 7 ` + condition + ` and p.productSale != 0 and p.status = 'N'
  limit ` + page + `, ` + size + `;  
  `;

  const [newSaleProductRow] = await connection.query(newSaleProductQuery, [condition, page, size]);

  return newSaleProductRow;
};

// Get New Product
async function selectNewProduct(connection, [page, size]) {

  const newProductQuery = `
    select p.storeIdx,
    p.productIdx,
    thumbnailUrl,
    zFlag,
    s.storeName,
    productContents,
    case
    when productSale > 0 and zSaleFlag = 'Y'
        then '제트할인가'
    else '' end                                       as zSaleStatus,
    case
    when productSale > 0 and zSaleFlag = 'Y'
        then format(productPrice, 0)
    else
        '' end                                        as originPrice,
    case
    when productSale > 0
        then concat(productSale, '%')
    else '' end                                       as salePercentage,
    format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
    case
        when s.deliveryPrice = 0
            then '무료배송'
        else
            '' end                      as deliveryPrice,
    case
        when p.brandIdx is null
            then ''
        else
            '브랜드' end                   as brandStatus
    from Product p
        left join Store s on s.storeIdx = p.storeIdx
    where timestampdiff(day, p.createdAt, CURRENT_TIMESTAMP()) < 7 and p.status = 'N'
    limit ` + page + `, ` + size + `;
  `;

  const [newProductRow] = await connection.query(newProductQuery, [page, size]);
  
  return newProductRow;
};

// Get Product Image
async function selectProductImage(connection, productIdx) {

  const productImageQuery = `
    select productImage
    from Product p
    left join ProductImage pi on p.productIdx = pi.productIdx
    where p.productIdx = ? and p.status = 'N';
  `;

  const [productImageRow] = await connection.query(productImageQuery, productIdx);
  
  return productImageRow;
}

// Get Product Intro
async function selectProductIntro(connection, productIdx) {

  const productIntroQuery = `
    select s.storeIdx, p.productIdx, zFlag, productContents, round(ifnull(sum(r.score) / count(r.reviewIdx), 0), 1) as score, count(r.reviewIdx) as reviewCount,
    case
    when productSale > 0 and zSaleFlag = 'Y'
        then '제트할인가'
    else '' end                                       as zSaleStatus,
    case
    when productSale > 0
        then concat(productSale, '%')
    else '' end                                       as salePercentage,
    format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
    case
    when productSale > 0 and zSaleFlag = 'Y'
        then format(productPrice, 0)
    else
        '' end                                        as originPrice,
    s.productPayInfo,
    case
        when 8 < date_format(now(), '%H') and date_format(now(), '%H') < 21
            then concat('내일 도착 예정')
      else
            concat('내일 모레 도착 예정') end as productReceiptDay,
    case
        when s.deliveryPrice = 0
            then '조건 없이 무료'
        else
            s.deliveryPrice end                      as deliveryPrice,
    s.deliveryInfo, s.reInfo

    from Product p
      left join Review r on r.productIdx = p.productIdx
      left join Store s on s.storeIdx = p.storeIdx
    where p.productIdx = ?;
  `;

  const [productIntroRow] = await connection.query(productIntroQuery, productIdx);
  
  return productIntroRow;
}

// Insert ReadCount
async function insertReadCount(connection, [productIdx, userIdx]) {

  const insertReadCountQuery = `
    insert into ReadCount(productIdx, userIdx) VALUES (?, ?);
  `;

  const [insertReadRow] = await connection.query(insertReadCountQuery, [productIdx, userIdx]);
  
  return insertReadRow;
}

// Get Store Info
async function selectStoreInfo(connection, [userIdx, storeIdx]) {

  const storeInfoQuery = `
  select storeUrl, storeName, count(b.storeIdx) as bookmarkCount, ifnull(bookmarkStatus, 'N') as bookmarkStatus
  from Store s
  left join Bookmark b on s.storeIdx = b.storeIdx
           left join (select b.status as bookmarkStatus, s.storeIdx from Store s left join Bookmark b on b.storeIdx = s.storeIdx
            where userIdx = ?) as v on v.storeIdx = s.storeIdx
  where s.storeIdx = ?;
  `;
  const [storeInfoRow] = await connection.query(storeInfoQuery, [userIdx, storeIdx]);

  return storeInfoRow;
}

// Get BookMark Store Status
async function selectStoreStatus(connection, userIdx) {

  const bookMarkStatusQuery = `
    select s.storeIdx, bm.status
    from Store s
    left join Bookmark bm on bm.storeIdx = s.storeIdx
    where bm.userIdx = ?;
    `;
  const [bookMarkStatusRow] = await connection.query(bookMarkStatusQuery, userIdx);
  
  return bookMarkStatusRow;
}

// Get First Category Reference  List
async function selectFirstCategoryList(connection, storeIdx) {

  const categoryListQuery = `
    select c.categoryRef
    from Store s
    left join Product p on p.storeIdx = s.storeIdx
    left join Category c on p.categoryIdx = c.categoryIdx
    where s.storeIdx = ?
    group by c.categoryRef;
    `;
  const [categoryListRow] = await connection.query(categoryListQuery, storeIdx);
  
  return categoryListRow;
}

// Get Second Category Reference  List
async function selectSecondCategoryList(connection, categoryRef) {

  const categoryListQuery = `
  select c.categoryRef
  from Category c
  where categoryIdx = ?;
    `;
  const [categoryListRow] = await connection.query(categoryListQuery, categoryRef);
  
  return categoryListRow;
}

// Get Last Category List
async function selectLastCategoryList(connection, categoryRef) {

  const categoryListQuery = `
    select c.categoryIdx, c.categoryName
    from Category c
    where categoryIdx = ?;
    `;
  const [categoryListRow] = await connection.query(categoryListQuery, categoryRef);

  return categoryListRow;
}

// Get Product Coupon List
async function selectProductCoupon(connection, [productIdx, userIdx]) {

  const couponListQuery = `
    select c.couponIdx, concat(format(c.couponPrice, 0), '원') as couponPrice, c.couponName,
    case
      when c.couponMin = 0
       then '전 상품 가격 상관 없이 사용 가능'
    else
       concat('총 상품', format(c.couponMin, 0), '원 이상 구매 시 사용 가능') end as minPrice
  from Product p
  left join Coupon c on c.productIdx = p.productIdx
  where p.productIdx = ? and p.status = 'N';
    `;
  const [couponListRow] = await connection.query(couponListQuery, [productIdx]);
  
  return couponListRow;
}

// Insert Product Coupon
async function insertProductCoupon(connection, [couponIdx, userIdx]) {
  const insertCouponQuery = `
    insert into CouponUser(couponIdx, userIdx)
    values (?, ?);
    `;
  const [insertCouponRow] = await connection.query(insertCouponQuery, [couponIdx, userIdx]);

  return insertCouponRow;
}

// Get Store Name
async function selectStoreName(connection, productIdx) {

  const storeNameQuery = `
  select concat(s.storeName, ' 쿠폰') as storeName
  from Store s
  left join Product p on s.storeIdx = p.storeIdx
  where productIdx = ?;
    `;
  const [storeNameRow] = await connection.query(storeNameQuery, productIdx);
  
  return storeNameRow;
}

// Get Category Product
async function selectCategoryProduct(connection, [condition, storeIdx, page, size]) {

  const categoryProductQuery = `
    select p.storeIdx,
       p.productIdx,
       thumbnailUrl,
       zFlag,
       s.storeName,
       productContents,
       case
       when productSale > 0 and zSaleFlag = 'Y'
           then '제트할인가'
       else '' end                                       as zSaleStatus,
     case
       when productSale > 0 and zSaleFlag = 'Y'
           then format(productPrice, 0)
       else
           '' end                                        as originPrice,
     case
       when productSale > 0
           then concat(productSale, '%')
       else '' end                                       as salePercentage,

   format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
       case
           when s.deliveryPrice = 0
               then '무료배송'
           else
               '' end                      as deliveryPrice,
       case
           when p.brandIdx is null
               then ''
           else
               '브랜드' end                   as brandStatus
  from Product p
         left join Store s on s.storeIdx = p.storeIdx
         left join Category c on p.categoryIdx = c.categoryIdx
  where p.storeIdx = ? and p.status = 'N' ` + condition + `
  limit ` + page + `, ` + size + `;
    `;
  const [categoryProductRow] = await connection.query(categoryProductQuery, [storeIdx, condition, page, size]);
  
  return categoryProductRow;
}

// Get Product Info
async function selectProductInfo(connection, productIdx) {

  const productInfoQuery = `
    select productIntro, cg.categoryName, c.colorName, s.sizeName, date_format(p.createdAt, '%Y.%m.%d') as createdAt, productPrec, country, storeName, quality, storePhoneNum
    from Product p
      left join Store st on p.storeIdx = st.storeIdx
      left join Category cg on cg.categoryIdx = p.categoryIdx
      left join ProductDetail pd on p.productIdx = pd.productIdx
      left join Color c on pd.colorIdx = c.colorIdx
      left join Size s on s.sizeIdx = pd.sizeIdx
    where p.productIdx = ?;
    `;
  const [productInfoRow] = await connection.query(productInfoQuery, productIdx);

  return productInfoRow;
}

// Get Recommendation Product
async function selectRecommendationProduct(connection, storeIdx) {

  const recommendationProductQuery = `
    select p.storeIdx,
       p.productIdx,
       thumbnailUrl,
       zFlag,
       s.storeName,
       productContents,
      case
        when productSale > 0 and zSaleFlag = 'Y'
            then '제트할인가'
        else '' end                                       as zSaleStatus,
      case
        when productSale > 0 and zSaleFlag = 'Y'
            then format(productPrice, 0)
        else
            '' end                                        as originPrice,
      case
        when productSale > 0
            then concat(productSale, '%')
        else '' end                                       as salePercentage,

    format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
       case
           when s.deliveryPrice = 0
               then '무료배송'
           else
               '' end                      as deliveryPrice,
       case
           when p.brandIdx is null
               then ''
           else
               '브랜드' end                   as brandStatus
    from Product p
         left join Store s on s.storeIdx = p.storeIdx
    where s.storeIdx = ? and p.status = 'N'
    order by rand()
    limit 15;
    `;
  const [recommendationProductRow] = await connection.query(recommendationProductQuery, storeIdx);

  return recommendationProductRow;
}

// Get Review Title
async function selectReviewTitle(connection, productIdx) {

  const reviewTitleQuery = `
    select p.productIdx,
       concat('리뷰(', count(r.reviewIdx), ')')                      as titleReviewCount,
       concat('리뷰 ', count(r.reviewIdx))                           as reviewCount,
       concat(round(sum(r.score) / count(r.reviewIdx), 1), ' / 5') as score,
       concat((select rs.contents
               from Product p
                        left join Review r on r.productIdx = p.productIdx
                        left join ReviewSize rs on r.sizeIdx = rs.sizeIdx
               where p.productIdx = ?
                 and r.status = 'N'
               group by r.sizeIdx
               order by count(r.sizeIdx) DESC
               limit 1), '(', round(max(sizeCount) / sum(sizeCount) * 100, 0), '% • ',
              max(sizeCount), '명)')                                as size,
       concat((select rc.contents
               from Product p
                        left join Review r on r.productIdx = p.productIdx
                        left join ReviewColor rc on rc.colorIdx = r.colorIdx
               where p.productIdx = ?
                 and r.status = 'N'
               group by r.sizeIdx
               order by count(r.colorIdx) DESC
               limit 1), '(', round(max(colorCount) / sum(colorCount) * 100, 0), '% • ',
              max(colorCount), '명)')                               as color,
       concat((select rq.contents
               from Product p
                        left join Review r on r.productIdx = p.productIdx
                        left join ReviewQuality rq on rq.qualityIdx = r.qualityIdx
               where p.productIdx = ?
                 and r.status = 'N'
               group by r.qualityIdx
               order by count(r.qualityIdx) DESC
               limit 1), '(', round(max(qualityCount) / sum(qualityCount) * 100, 0),
              '% • ', max(qualityCount), '명)')                     as quality

  from Product p
         left join Review r on p.productIdx = r.productIdx
         left join (select count(r.colorIdx) as colorCount, p.productIdx, r.reviewIdx
                    from Product p
                             left join Review r on r.productIdx = p.productIdx
                    where p.productIdx = ?
                      and r.status = 'N'
                    group by r.sizeIdx) as w on w.reviewIdx = r.reviewIdx
         left join (select count(r.qualityIdx) as qualityCount, p.productIdx, r.reviewIdx
                    from Product p
                             left join Review r on r.productIdx = p.productIdx
                    where p.productIdx = ?
                      and r.status = 'N'
                    group by r.qualityIdx) as x on x.reviewIdx = r.reviewIdx
         left join (select count(r.sizeIdx) as sizeCount, p.productIdx, r.reviewIdx
                    from Product p
                             left join Review r on r.productIdx = p.productIdx
                    where p.productIdx = ?
                      and r.status = 'N'
                    group by r.sizeIdx) as v on v.reviewIdx = r.reviewIdx
  where p.productIdx = ?;
    `;
  const [reviewTitleRow] = await connection.query(reviewTitleQuery, [productIdx, productIdx, productIdx, productIdx, productIdx, productIdx, productIdx]);

  return reviewTitleRow;
}

// Get Review Contents
async function selectReviewContents(connection, productIdx) {

  const reviewContentsQuery = `
    select r.reviewIdx,
        u.nickName,
        date_format(r.createdAt, '%y.%m.%d') as createdAt,
        r.score                              as score,
        rs.contents                          as size,
        rc.contents                          as color,
        rq.contents                          as quality,
        concat(colorName, ' / ', sizeName)    as productOption,
        r.reviewContents
  from Product p
          left join Review r
                    on p.productIdx = r.productIdx
          left join ReviewQuality rq on rq.qualityIdx = r.qualityIdx
          left join ReviewSize rs on rs.sizeIdx = r.sizeIdx
          left join ReviewColor rc on rc.colorIdx = r.colorIdx
          left join OrderProduct op on op.orderIdx = r.orderIdx
          left join Basket b on op.basketIdx = b.basketIdx
          left join ProductBasket pb on b.basketIdx = pb.basketIdx
          left join ProductDetail pd on pd.productDetailIdx = pb.productDetailIdx
          left join Size s on s.sizeIdx = pd.sizeIdx
          left join Color c on pd.colorIdx = c.colorIdx
          left join User u on r.userIdx = u.userIdx
    where p.productIdx = ?
    and r.status = 'N' and op.confirm = 'Y'
    group by u.userIdx
    order by r.createdAt
    limit 5;
    `;
  const [reviewContentsRow] = await connection.query(reviewContentsQuery, productIdx);

  return reviewContentsRow;
}

// Get Review Contents
async function selectReviewImage(connection, reviewIdx) {

  const reviewImageQuery = `
    select reviewImage
    from Product p
            left join Review r on p.productIdx = r.productIdx
            left join ReviewImage ri on ri.reviewIdx = r.reviewIdx
    where r.reviewIdx = ?
      and r.status = 'N';
    `;
  const [reviewImageRow] = await connection.query(reviewImageQuery, reviewIdx);

  return reviewImageRow;
}

// Get Review Total Title
async function selectReviewTotalTitle(connection, productIdx) {

  const reviewTitleQuery = `
    select p.productIdx,
       concat('Z리뷰 ', count(r.reviewIdx))                      as titleReviewCount,
       concat(round(sum(r.score) / count(r.reviewIdx), 1), ' / 5') as score,
       concat((select rs.contents
               from Product p
                        left join Review r on r.productIdx = p.productIdx
                        left join ReviewSize rs on r.sizeIdx = rs.sizeIdx
               where p.productIdx = ?
                 and r.status = 'N'
               group by r.sizeIdx
               order by count(r.sizeIdx) DESC
               limit 1), '(', round(max(sizeCount) / sum(sizeCount) * 100, 0), '% • ',
              max(sizeCount), '명)')                                as size,
       concat((select rc.contents
               from Product p
                        left join Review r on r.productIdx = p.productIdx
                        left join ReviewColor rc on rc.colorIdx = r.colorIdx
               where p.productIdx = ?
                 and r.status = 'N'
               group by r.sizeIdx
               order by count(r.colorIdx) DESC
               limit 1), '(', round(max(colorCount) / sum(colorCount) * 100, 0), '% • ',
              max(colorCount), '명)')                               as color,
       concat((select rq.contents
               from Product p
                        left join Review r on r.productIdx = p.productIdx
                        left join ReviewQuality rq on rq.qualityIdx = r.qualityIdx
               where p.productIdx = ?
                 and r.status = 'N'
               group by r.qualityIdx
               order by count(r.qualityIdx) DESC
               limit 1), '(', round(max(qualityCount) / sum(qualityCount) * 100, 0),
              '% • ', max(qualityCount), '명)')                     as quality,
              concat('전체 리뷰 ', count(r.reviewIdx))                           as reviewCount,
              (select count(r.reviewIdx) from Product p left join Review r on p.productIdx = r.productIdx where imageFlag = 'N' and p.productIdx = ?) as photoCount

  from Product p
         left join Review r on p.productIdx = r.productIdx
         left join (select count(r.colorIdx) as colorCount, p.productIdx, r.reviewIdx
                    from Product p
                             left join Review r on r.productIdx = p.productIdx
                    where p.productIdx = ?
                      and r.status = 'N'
                    group by r.sizeIdx) as w on w.reviewIdx = r.reviewIdx
         left join (select count(r.qualityIdx) as qualityCount, p.productIdx, r.reviewIdx
                    from Product p
                             left join Review r on r.productIdx = p.productIdx
                    where p.productIdx = ?
                      and r.status = 'N'
                    group by r.qualityIdx) as x on x.reviewIdx = r.reviewIdx
         left join (select count(r.sizeIdx) as sizeCount, p.productIdx, r.reviewIdx
                    from Product p
                             left join Review r on r.productIdx = p.productIdx
                    where p.productIdx = ?
                      and r.status = 'N'
                    group by r.sizeIdx) as v on v.reviewIdx = r.reviewIdx
  where p.productIdx = ?;
    `;
  const [reviewTitleRow] = await connection.query(reviewTitleQuery, [productIdx, productIdx, productIdx, productIdx, productIdx, productIdx, productIdx, productIdx]);

  return reviewTitleRow;
}

// Get Total Review Contents
async function selectReviewTotalContents(connection, [productIdx, page, size, condition, pcondition]) {
  const reviewContentsQuery = `
    select r.reviewIdx,
    u.nickName,
    date_format(r.createdAt, '%y.%m.%d')                                               as createdAt,
    r.score                                                                            as score,
    concat(colorName, ' / ', sizeName)                                                 as choiceOption,
    concat('사이즈 "', rs.contents, '", 색감 "', rc.contents, '", 퀄리티 "', rq.contents, '"') as oneLine,
    r.reviewContents,
    ifnull(likeCount, 0)                                                               as likeCount,
    ifnull(hateCount, 0)                                                               as hateCount
    from Product p
      left join Review r
                on p.productIdx = r.productIdx
      left join (select ifnull(count(lfr.reviewIdx), 0) as likeCount, lfr.reviewIdx
                from LikeFlagReview lfr
                where lfr.likeFlag = 'Y'
                group by lfr.reviewIdx) as v on r.reviewIdx = v.reviewIdx
      left join (select ifnull(count(lfr.reviewIdx), 0) as hateCount, lfr.reviewIdx
                from LikeFlagReview lfr
                where lfr.likeFlag = 'N'
                group by lfr.reviewIdx) as w on r.reviewIdx = w.reviewIdx
      left join ReviewQuality rq on rq.qualityIdx = r.qualityIdx
      left join ReviewSize rs on rs.sizeIdx = r.sizeIdx
      left join ReviewColor rc on rc.colorIdx = r.colorIdx
      left join OrderProduct op on op.orderIdx = r.orderIdx
      left join Basket b on op.basketIdx = b.basketIdx
      left join ProductBasket pb on b.basketIdx = pb.basketIdx
      left join ProductDetail pd on pd.productDetailIdx = pb.productDetailIdx
      left join Size s on s.sizeIdx = pd.sizeIdx
      left join Color c on pd.colorIdx = c.colorIdx
      left join User u on r.userIdx = u.userIdx
    where p.productIdx = ?
    and r.status = 'N' 
     and op.status = 'Y' ` + pcondition + `
    group by u.userIdx
    ` + condition + `
    limit ` + page + `, ` + size + `;
    `;
  const [reviewContentsRow] = await connection.query(reviewContentsQuery, [productIdx, page, size, condition, pcondition]);

  return reviewContentsRow;
}

// Get Like Flag Review
async function selectLikeFlag(connection, [userIdx, reviewIdx]) {

  const likeFlagQuery = `
    select likeFlag
    from Review r
    left join LikeFlagReview lf on lf.reviewIdx = r.reviewIdx
    left join User u on u.userIdx = lf.userIdx
    where u.userIdx = ? and lf.status = 'N' and r.reviewIdx = ?
    `;
  const [likeFlagRow] = await connection.query(likeFlagQuery, [userIdx, reviewIdx]);

  return likeFlagRow;
}


// Insert Product Like
async function insertLike(connection, [productIdx, userIdx]) {

  const insertLikeQuery = `
    insert into LikeProduct(productIdx, userIdx)
    values (?, ?);
    `;
  const [insertLikeRow] = await connection.query(insertLikeQuery, [productIdx, userIdx]);

  return insertLikeRow;
}

// Insert Store Bookmark
async function insertStore(connection, [storeIdx, userIdx]) {

  const insertBookmarkQuery = `
    insert into Bookmark(storeIdx, userIdx)
    values (?, ?);
    `;
  const [insertBookmarkRow] = await connection.query(insertBookmarkQuery, [storeIdx, userIdx]);

  return insertBookmarkRow;
}

// Insert Brand Bookmark
async function insertBrand(connection, [brandIdx, userIdx]) {

  const insertBookmarkQuery = `
    insert into Bookmark(brandIdx, userIdx)
    values (?, ?);
    `;
  const [insertBookmarkRow] = await connection.query(insertBookmarkQuery, [brandIdx, userIdx]);

  return insertBookmarkRow;
}


// Update Like Bookmark
async function updateLike(connection, [productIdx, userIdx, status]) {

  const updateBookmarkQuery = `
    update LikeProduct
    set status = ?
    where productIdx = ? and userIdx = ?;
    `;
  const [updateLikeRow] = await connection.query(updateBookmarkQuery, [status, productIdx, userIdx]);

  return updateLikeRow;
}

// Update Store Bookmark
async function updateStore(connection, [storeIdx, userIdx, status]) {

  const updateBookmarkQuery = `
    update Bookmark
    set status = ?
    where storeIdx = ? and userIdx = ?;
    `;
  const [updateBookmarkRow] = await connection.query(updateBookmarkQuery, [status, storeIdx, userIdx]);

  return updateBookmarkRow;
}

// Update Brand Bookmark
async function updateBrand(connection, [brandIdx, userIdx, status]) {

  const updateBookmarkQuery = `
    update Bookmark
    set status = ?
    where brandIdx = ? and userIdx = ?;
    `;
  const [updateBookmarkRow] = await connection.query(updateBookmarkQuery, [status, brandIdx, userIdx]);

  return updateBookmarkRow;
}

// Insert LikeFlag
async function insertLikeFlag(connection, [reviewIdx, userIdx, status]) {

  const insertLikeFlagQuery = `
    insert into LikeFlagReview(reviewIdx, userIdx, likeFlag)
    values (?, ?, ?);
    `;
  const [insertLikeFlagRow] = await connection.query(insertLikeFlagQuery, [reviewIdx, userIdx, status]);

  return insertLikeFlagRow;
}


// Update LikeFlag
async function updateLikeFlag(connection, [reviewIdx, userIdx, status]) {

  const updateLikeFlagQuery = `
    update LikeFlagReview
    set likeFlag = ?
    where reviewIdx = ? and userIdx = ?;
    `;
  const [updateLikeFlagRow] = await connection.query(updateLikeFlagQuery, [status, reviewIdx, userIdx]);

  return updateLikeFlagRow;
}

// Update LikeFlag
async function updateLikeFlagStatus(connection, [reviewIdx, userIdx]) {

  const updateLikeFlagQuery = `
    update LikeFlagReview
    set status = 'N'
    where reviewIdx = ? and userIdx = ?;
    `;
  const [updateLikeFlagRow] = await connection.query(updateLikeFlagQuery, [reviewIdx, userIdx]);

  return updateLikeFlagRow;
}

// Select Bookmark Store Product
async function selectProductList(connection, [userIdx, page, size]) {

  const productListQuery = `
    select p.storeIdx, s.storeUrl,
    s.storeName,
    p.productIdx,
    thumbnailUrl,
    zFlag,
    productContents,
    case
    when productSale > 0 and zSaleFlag = 'Y'
        then '제트할인가'
    else '' end                                       as zSaleStatus,
case
    when productSale > 0 and zSaleFlag = 'Y'
        then format(productPrice, 0)
    else
        '' end                                        as originPrice,
case
    when productSale > 0
        then concat(productSale, '%')
    else '' end                                       as salePercentage,

format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
    case
      when s.deliveryPrice = 0
            then '무료배송'
        else
                '' end as deliveryPrice,
                case
          when p.brandIdx is null
              then ''
          else
              '브랜드' end                   as brandStatus,
      ifnull(likeStatus, 'N') as likeStatus
    from Store s
    left join Product p on p.storeIdx = s.storeIdx
    left join (select ifnull(lp.status, 'N') as likeStatus, p.productIdx from Store s left join Product p on p.storeIdx = s.storeIdx
      left join LikeProduct lp on lp.productIdx = p.productIdx where s.status = 'N' and p.status = 'n' and lp.userIdx = ?) as v on v.productIdx = p.productIdx
    left join Bookmark b on b.storeIdx = s.storeIdx
    left join User u on u.userIdx = b.userIdx
    where p.status= 'N' and s.status = 'N' and b.userIdx = ? and b.status = 'Y' and timestampdiff(day, p.createdAt, current_timestamp()) < 7
    group by p.productIdx
    limit ` + page + `, ` + size + `;
    `;
  const [productListRow] = await connection.query(productListQuery, [userIdx, userIdx, page, size]);

  return productListRow;
}

// Select Search Product
async function selectSearchProductList(connection, [userIdx, contents, categoryCondition, deliveryCondition, originalCondition, page, size]) {

  const productListQuery = `
  select p.productIdx,
  thumbnailUrl,
  p.storeIdx,
  s.storeName,
  zFlag,
  productContents,
  case
  when productSale > 0 and zSaleFlag = 'Y'
      then '제트할인가'
  else '' end                                       as zSaleStatus,
case
  when productSale > 0 and zSaleFlag = 'Y'
      then format(productPrice, 0)
  else
      '' end                                        as originPrice,
case
  when productSale > 0
      then concat(productSale, '%')
  else '' end                                       as salePercentage,

format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
  case
    when s.deliveryPrice = 0
          then '무료배송'
      else
              '' end as deliveryPrice,
              case
       when p.brandIdx is null
           then ''
       else
           '브랜드' end                   as brandStatus,
   ifnull(likeStatus, 'N') as likeStatus
from Product p
left join Store s on p.storeIdx = s.storeIdx
left join ProductDetail pd on pd.productIdx = p.productIdx
left join ProductBasket pb on pb.productDetailIdx = pd.productDetailIdx
left join Basket bs on bs.basketIdx = pb.basketIdx
left join OrderProduct op on op.basketIdx = bs.basketIdx
left join (select ifnull(lp.status, 'N') as likeStatus, p.productIdx from Product p
    left join LikeProduct lp on lp.productIdx = p.productIdx where p.status = 'n' and lp.userIdx = ?) as v on v.productIdx = p.productIdx
    left join (select count(rc.productIdx) as readCount, productIdx from ReadCount rc group by productIdx) as x on x.productIdx=p.productIdx
    left join (select ifnull(count(r.reviewIdx), 0)               as reviewCount,
                          productIdx
                  from Review r
                  group by r.productIdx) as w on w.productIdx = p.productIdx
    left join Category c on c.categoryIdx = p.categoryIdx
where p.status= 'N' and s.status = 'N' and p.productContents like '%` + contents + `%' `+ categoryCondition +` ` + deliveryCondition +`
group by p.productIdx
` + originalCondition + `
limit ` + page + `, ` + size +`;
    `;
  const [productListRow] = await connection.query(productListQuery, [userIdx, contents, categoryCondition, deliveryCondition, originalCondition, page, size]);

  return productListRow;
}

// Check CategoryIdx
async function selectCheckCategoryIdx(connection, [brandIdx, categoryIdx]) {

  const checkQuery = `
    select exists (select categoryIdx from Brand b left join Product p on p.brandIdx = b.brandIdx where p.brandIdx = ? and categoryIdx = ?) as exist
    `;
  const [checkRow] = await connection.query(checkQuery, [brandIdx, categoryIdx]);

  return checkRow;
}

// Select Option
async function selectOption(connection, productIdx) {

  const optionQuery = `
  select c.colorIdx, c.colorName
  from Product p
  left join ProductDetail pd on pd.productIdx = p.productIdx
  left join Color c on c.colorIdx = pd.colorIdx
  where p.status = 'N' and p.productIdx = 1 and pd.productNum != 0
  group by c.colorIdx;
    `;
  const [colorRow] = await connection.query(optionQuery, productIdx);
  return colorRow;
}

// Check ColorIdx
async function selectColorCheck(connection, [productIdx, colorIdx]) {

  const Query = `
  select exists (select pd.colorIdx from Product p left join ProductDetail pd on pd.productIdx = p.productIdx
    left join Color c on pd.colorIdx = c.colorIdx where p.productIdx = ? and c.colorIdx = ?) as exist
 
    `;
  const [row] = await connection.query(Query, [productIdx, colorIdx]);
  return row;
}

// Select Size
async function selectSize(connection, [productIdx, colorIdx]) {

  const Query = `select s.sizeIdx, s.sizeName,
  case
       when pd.productIdx = 0
           then '품절'
       else
           '' end as notExistStatus
from Product p
left join ProductDetail pd on p.productIdx = pd.productIdx
left join Color c on pd.colorIdx = c.colorIdx
left join Size s on s.sizeIdx = pd.sizeIdx
where p.productIdx = ? and c.colorIdx = ?
group by s.sizeIdx
  
    `;
  const [row] = await connection.query(Query, [productIdx, colorIdx]);
  return row;
}

// Category Product Result
async function selectCateProduct(connection, [userIdx, categoryCondition, deliveryCondition, originalCondition, page, size]) {
  const cateProductQuery = `
  select p.productIdx,
       thumbnailUrl,
       p.storeIdx,
       s.storeName,
       zFlag,
       productContents,
       case
           when productSale > 0 and zSaleFlag = 'Y'
               then '제트할인가'
           else '' end                                       as zSaleStatus,
       case
           when productSale > 0 and zSaleFlag = 'Y'
               then format(productPrice, 0)
           else
               '' end                                        as originPrice,
       case
           when productSale > 0
               then concat(productSale, '%')
           else '' end                                       as salePercentage,

       format(productPrice * ((100 - productSale) / 100), 0) as resultPrice,
       case
           when s.deliveryPrice = 0
               then '무료배송'
           else
               '' end                                        as deliveryPrice,
       case
           when p.brandIdx is null
               then ''
           else
               '브랜드' end                                     as brandStatus,
       ifnull(likeStatus, 'N')                               as likeStatus
from Product p
         left join Store s
                   on p.storeIdx = s.storeIdx
         left join ProductDetail pd on pd.productIdx = p.productIdx
         left join ProductBasket pb on pb.productDetailIdx = pd.productDetailIdx
         left join Basket bs on bs.basketIdx = pb.basketIdx
         left join OrderProduct op on op.basketIdx = bs.basketIdx
         left join (select ifnull(lp.status, 'N') as likeStatus, p.productIdx
                    from Product p
                             left join LikeProduct lp on lp.productIdx = p.productIdx
                    where p.status = 'N' and userIdx = ?) as v on v.productIdx = p.productIdx
         left join (select count(rc.productIdx) as readCount, productIdx from ReadCount rc group by productIdx) as x
                   on x.productIdx = p.productIdx
         left join (select ifnull(count(r.reviewIdx), 0) as reviewCount,
                           productIdx
                    from Review r
                    group by r.productIdx) as w on w.productIdx = p.productIdx
         left join Category c on c.categoryIdx = p.categoryIdx
where p.status = 'N'
  and s.status = 'N' `+ categoryCondition +` ` + deliveryCondition +`
group by p.productIdx
` + originalCondition + `
limit ` + page + `, ` + size +`;


     `;
  const [productRow] = await connection.query(cateProductQuery, [userIdx, categoryCondition, deliveryCondition, originalCondition, page, size]);
  return productRow;
}




module.exports = {
    selectHomeProduct,
    selectOption,
    selectCateProduct,
    selectColorCheck,
    selectSize,
    selectLikeProductStatus,
    selectUserIdx,
    selectReviewIdx,
    selectLikeReviewStatus,
    selectStoreIdx,
    selectProductIdx,
    selectBrandIdx,
    selectBrandProduct,
    selectCategoryIdx,
    selectBrandRank,
    selectBrandTotalRank,
    selectBookMarkStatus,
    selectRankBrandProduct,
    selectBrandIntro,
    selectWeekBestProduct,
    selectCategoryList,
    selectBrandCategoryProduct,
    selectBrandCoupon,
    selectBrandName,
    haveFlag,
    insertBrandCoupon,
    selectBestProduct,
    selectTimeSaleProduct,
    selectSaleProduct,
    selectSaleNewProduct,
    selectNewProduct,
    selectProductImage,
    selectProductIntro,
    insertReadCount,
    selectStoreInfo,
    selectStoreStatus,
    selectFirstCategoryList,
    selectSecondCategoryList,
    selectLastCategoryList,
    selectCategoryProduct,
    selectProductInfo,
    selectStoreName,
    selectProductCoupon,
    insertProductCoupon,
    selectRecommendationProduct,
    selectBrandBookmarkStatus,
    selectStoreBookmarkStatus,
    selectLikeStatus,
    insertLike,
    insertStore,
    insertBrand,
    updateLike,
    updateStore,
    updateBrand,
    selectHomeSlideProduct,
    selectReviewTitle,
    selectReviewContents,
    selectReviewImage,
    selectReviewTotalTitle,
    selectReviewTotalContents,
    selectLikeFlag,
    updateLikeFlag,
    insertLikeFlag,
    selectLikeFlagStatus,
    updateLikeFlagStatus,
    selectProductList,
    selectSearchProductList,
    selectCheckCategoryIdx,
    selectBenefitProduct
  };
  