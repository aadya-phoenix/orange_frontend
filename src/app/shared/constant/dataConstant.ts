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
    '((([-A-Za-z\\d]([-A-Za-z\\d-]*[-A-Za-z\\d])*)\\.)+[A-Za-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-A-Za-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&A-Za-z\\d%_.:/?~+=-]*)?' + // query string
    '(\\#[-A-Za-z\\d_]*)?$',
  NumbersOnlyPattern: '^[0-9]+$',
  EuroCurrencyPattern: '^[0-9,]*$',
  CurrencyPattern: '^(?!0\.00)\d{1,3}(,\d{3})*(\.\d\d)?$',
  PasswordPattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
  Ratings: [{ id: 1, value: 'Very Bad' }, { id: 2, value: 'Bad' }, { id: 3, value: 'Okay' }, { id: 4, value: 'Good' }, { id: 5, value: 'Excellent' }],

  DesignRatings: [{ id: 1, value: 'Poor' }, { id: 2, value: 'Below Average' }, { id: 3, value: 'Average' }, { id: 4, value: 'Above Average' }, { id: 5, value: 'Excellent' }],

  CourseStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish: 'publish', reject: 'reject', expired: 'expired' },
  CarouselStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish: 'publish', reject: 'reject', expired: 'expired' },
  SMEStatus: { total: 'total', contecntSupport: 'content-support', delivery: 'delivery', voiceOver: 'voice-over-learning', active: 'active', deactive: 'deactive', draft: 'draft', pending: 'pending', reject: 'reject', approve: 'approve' },
  BackOfficeStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish: 'publish', reject: 'reject', expired: 'expired' },
  CourseSessionStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish: 'publish', reject: 'reject' },
  GoldToolStatus: { total: 'total', closed: 'closed', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish: 'publish', reject: 'reject' },
  VendorStatus: { total: 'total', active: 'active', deactive: 'deactive' },
  GetReportStatus: { total: 'total', closed: 'closed', close: 'close', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', publish: 'publish', reject: 'reject', expired: 'expired' },
  DnaStatus: {
    total: 'total', closed: 'closed', close: 'close', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', forwarded: 'forwarded', digital_learning: 'digital_learning'
  },
  DesignStatus: {
    total: 'total', closed: 'closed', close: 'close', draft: 'draft', pending: 'pending', rejected: 'rejected', submitted: 'submitted', transferred: 'transferred', reject: 'reject', forwarded: 'forwarded', digital_learning: 'digital_learning', forward: 'forward', approve: 'approve', feedback: 'feedback', change: 'change', onHold: 'on_hold'
  },
  ImageUrl: 'https://orange.mindscroll.info/public/public',
  BaseUrl: 'https://orange.mindscroll.info',
  ExporType: { course: 'course', session: 'session', digital_learning: 'digital_learning',carousel: 'carousel', back_office: 'back_office', vendor: 'vendor', vendor_rating: 'vendor_rating', get_report: 'get_report' },
  RoleID: {
    RequesterID: 2,
    CourseReviewer: 3,
    CoursePublisher: 4,
    CourseRequester: 2,
    CarouselReviewer: 7,
    CarouselPublisher: 8,
    BackOfficeReviewer: 3,
    BackOfficePublisher: 10,
    LearningPartner: 13,
    BussinessConsultant: 12,
    DomainExpert: 14,
    Rom: 5,
    Roc: 3,
    PlayListRole: 18,
    Publisher: 3,
    DataAnalyst: 11,
    DesignTeam: 16,
    HeadOfDesign: 17
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
  Laungauges: { EN: 'EN', FR: 'FR' },
  TitlePrefix: 'PD&L Tools',
  TitleList: {
    login: 'Login',
    home: 'Home',
    cct: 'Create new course',
    cct_create: 'Create new course - Create',
    cct_update: 'Create new course - Update',
    cct_view: 'Create new course - View',
    cct_report: 'Create new course - View All Activity Report',
    sct: 'Open course session (s)',
    sct_create: 'Open course session (s) - Create',
    sct_update: 'Open course session (s) - Update',
    sct_view: 'Open course session (s) - View',
    sct_report: 'Open course session (s) - View All Activity Report',
    olcarousel: 'Promote on Carousel',
    olcarousel_create: 'Promote on Carousel - Create',
    olcarousel_update: 'Promote on Carousel - Update',
    olcarousel_view: 'Promote on Carousel - View',
    olcarousel_report: 'Promote on Carousel - View All Activity Report',
    backOffice: 'Request back-office role',
    backOffice_create: 'Request back-office role - Create',
    backOffice_update: 'Request back-office role - Update',
    backOffice_view: 'Request back-office role - View',
    backOffice_report: 'Request back-office role - View All Activity Report',
    designlearning: 'Design learning Module',
    designlearning_create: 'Design learning Module - Create',
    designlearning_update: 'Design learning Module - Update',
    designlearning_view: 'Design learning Module - View',
    designlearning_report: 'Design learning Module - View All Activity Report',
    olreport: 'Get a Report',
    olreport_create: 'Get a Report - Create',
    olreport_update: 'Get a Report - Update',
    olreport_view: 'Get a Report - View',
    olreport_report: 'Get a Report - View All Activity Report',
    smedb: 'SME Database',
    smedb_create: 'SME Database - Create',
    smedb_update: 'SME Database - Update',
    smedb_view: 'SME Database - View',
    smedb_report: 'SME Database - View All Activity Report',
    vendormanagement: 'Manage Vendors',
    vendormanagement_create: 'Manage Vendors - Create',
    vendormanagement_update: 'Manage Vendors - Update',
    vendormanagement_view: 'Manage Vendors - View',
    vendormanagement_report: 'Manage Vendors - View All Activity Report',
    vendormanagement_rating: 'Manage Vendors - View Rating Report',
    pdltools: 'Dashboard',
    user: 'User Management',
    message: 'Message',
    sctworkflow: 'Session Workflow Status',
    setBackup: 'Set Backup',
    dna: 'Digital learning Needs Analysis',
    dna_create: 'Digital learning Needs Analysis - Create',
    dna_update: 'Digital learning Needs Analysis - Update',
    dna_view: 'Digital learning Needs Analysis - View',
    dna_report: 'Digital learning Needs Analysis - View All Activity Report',
    dna_user: 'Digital learning Needs Analysis - Users',
    dna_userEdit: 'Digital learning Needs Analysis - User - Edit',
    dna_tracker: 'Digital learning Needs Analysis - Tracker',
    dna_trackerCreate: 'Digital learning Needs Analysis - Tracker - Create',
    dna_trackerEdit: 'Digital learning Needs Analysis - Tracker - Update',
    dna_addNew: 'Digital learning Needs Analysis - Add New Learning',
    dna_managersdata: 'Digital learning Needs Analysis - Managers',
    dna_viewRPT: 'Digital learning Needs Analysis - View',
    dna_viewBP: 'Digital learning Needs Analysis - View',
    oltest: 'OL-Test',
  },

  Modules: {
    course: 'course',
    session: 'session',
    carousel: 'carousel',
    backOffice: 'back-office',
    dna: 'dna',
    sme: 'sme',
    vendor: 'vendor',
    getReport: 'get-report',
    design: 'design',
    goldTool: 'gold-tool'
  },
  ModuleList: [{
    name: 'Course', id: 'course'
  }, {
    name: 'Course Session', id: 'session'
  }, {
    name: 'Promote on carousel', id: 'carousel'
  }, {
    name: 'Request back-office role', id: 'back-office'
  }, {
    name: 'Learning Module', id: 'design'
  }, {
    name: 'Get a Report', id: 'get-report'
  }, {
    name: 'Learning Needs tool(DNA)', id: 'dna'
  }, {
    name: 'SME Database', id: 'sme'
  }],
  SMETabs: { contecntSupport: 'content-support', delivery: 'delivery', voiceOver: 'voice-over-learning', professionalCertifications: 'professional-certifications', comments: 'comments' }
}

