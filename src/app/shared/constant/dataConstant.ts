export const dataConstant = {
  StatusCode: {
    //Success
    200: '200',//OK
    201: '201',//Created
    204: '204',//No Content
    //Redirection
    304: '304',//Not Modified
    //Client Error
    400: '400',//Bad Request
    401: '401',//Unauthorized
    402: '402',//Created
    403: '403',//Forbidden
    404: '404',//Not Found
    409: '409',//Conflict
  },
  maxImageSize: 5, //5 Mb
  dateFormate : 'dd-MM-yyyy',
  dateTimeFormate: 'dd-MM-yyyy HH:mm a',
  EmailPattren: /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/,
  UrlPattern: '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-A-Za-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&A-Za-z\\d%_.:/?~+=-]*)?' + // query string
    '(\\#[-A-Za-z\\d_]*)?$',
  NumbersOnlyPattern:'^[0-9]+$',
 // CurrencyPattern:'/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/',
  CurrencyPattern:'^(?!0\.00)\d{1,3}(,\d{3})*(\.\d\d)?$',
  CarouselStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish: 'publish' , reject: 'reject', expired:'expired'},
  BackOfficeStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish: 'publish' , reject: 'reject', expired:'expired'},
  CourseSessionStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred' },
  ImageUrl: 'https://orange.mindscroll.info/public/public',
  RoleID: {
    RequesterID: 2,
    CarouselReviewer: 7,
    CarouselPublisher: 8,
    BackOfficeReviewer: 3,
    BackOfficePublisher: 10,
  },
  Laungauges : { EN:'EN', FR:'FR'}
}

