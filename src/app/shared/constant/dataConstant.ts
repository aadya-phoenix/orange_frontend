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
  dateFormate: 'dd-MM-yyyy',
  dateTimeFormate: 'dd-MM-yyyy HH:mm a',
  EmailPattren: /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/,
  UrlPattern: '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-A-Za-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&A-Za-z\\d%_.:/?~+=-]*)?' + // query string
    '(\\#[-A-Za-z\\d_]*)?$',
  NumbersOnlyPattern:'^[0-9]+$',
  EuroCurrencyPattern:'^[0-9,]*$',
  CurrencyPattern:'^(?!0\.00)\d{1,3}(,\d{3})*(\.\d\d)?$',
  PasswordPattern:'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
  Ratings: [{id:1, value:'Very Bad'},{id:2, value:'Bad'},{id:3, value:'Okay'},{id:4, value:'Good'},{id:5, value:'Excellent'}],
  CourseStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish: 'publish', reject: 'reject', expired: 'expired' },
  CarouselStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish: 'publish' , reject: 'reject', expired:'expired'},
  BackOfficeStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish: 'publish' , reject: 'reject', expired:'expired'},
  CourseSessionStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish:'publish' , reject: 'reject' },
  VendorStatus: { total: 'total', active:'active', deactive:'deactive'},
  GetReportStatus: {total: 'total', closed: 'closed', close: 'close',draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish: 'publish' , reject: 'reject', expired:'expired'},
  ImageUrl: 'https://orange.mindscroll.info/public/public',
  BaseUrl:'https://orange.mindscroll.info',
  ExporType : {course:'course', session:'session', carousel:'carousel', back_office:'back_office', vendor:'vendor', vendor_rating:'vendor_rating', get_report:'get_report'},
  RoleID: {
    RequesterID: 2,
    CourseReviewer: 7,
    CoursePublisher: 8,
    CourseRequester: 2,
    CarouselReviewer: 7,
    CarouselPublisher: 8,
    BackOfficeReviewer: 3,
    BackOfficePublisher: 10,
    Roc: 3,
    DataAnalyst: 11
  },
  LearningType: [
    {
      "id": 1,
      "name": "ILT and vILT training",
      "description": "Instructor-Led (ILT)-Instructor-Led Training is face to face training delivered in a classroom. Virtual Instructor-Led Training(vILT)-virtual instrutor-Led Training(vILT)is delivered remotely"
    },
    {
      "id": 2,
      "name": "Video-based training",
      "description": "Video-based training is either a self-learning online course or a recording of a virtual classroom session. The course file for video-based training is required in MP4 format (maximum file size: 500 MB)."
    },
    {
      "id": 3,
      "name": "Material-Based Training",
      "description": "A Material learning object is a self-learning resource. Material sources can be either one of the following file types: doc, docx, xls, xlsx, ppt, pptx, pps, ppsx, pdf, jpeg, jpe, jpg, gif, zip (maximum file size is 50 MB), or a URL link to an external resource/site."
    },
    {
      "id": 4,
      "name": "Curriculum",
      "description": "A curriculum is a learning object in which you can aggregate all other types of learning objects to create a learning path with a certain purpose (e.g. to develop specific skills and competencies)."
    },
    {
      "id": 5,
      "name": "Web-based training (AICC/SCORM)",
      "description": "Web-based training (WBT) is a training provided through the Internet or the Intranet on a Web browser. A WBT is said to be AICC or SCORM compliant if the completion of modules in the training is done automatically."
    },
    {
      "id": 6,
      "name": "Playlist",
      "description": "A playlist is a collection of learning content, selected either from the Orange Learning catalogue or from other platforms and available via a shared link in Orange Learning. This form enables you to request the conversion of a private playlist into a public playlist in order to easily share the knowledge with learners in a path-like structure. Public playlists are available to their target audience in the Orange Learning catalogue."
    }
  ],
  Laungauges : { EN:'EN', FR:'FR'},
  Modules:{
    course:'course',
    session:'session',
    carousel:'carousel',
    backOffice:'back-office',
    access:'access',
    sme:'sme',
    vendor:'vendor',
    getReport:'get-report',
    design: 'design'
  }
}

