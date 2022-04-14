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
  EmailPattren: /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/,
  UrlPattern: '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  CarouselStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred' },
  ImageUrl: 'https://orange.mindscroll.info/public/public'
}

