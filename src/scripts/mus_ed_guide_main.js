// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';

let config = void 0,
  megModel = void 0,
  imageDropzone = void 0,
  requiredFlag = false;
  thisForm = void 0;



let repo = "mus_ed_guide";
const form_id = "mus_ed_guide";
const app_container_id = ".mus_ed_guide_container";
let httpHost, mailSend;
let fid = null;
let app_api_url;

$(function () {
  httpHost = '/* @echo ENV*/';
  // @if ENV='local' || ENV='dev'
  console.log('running on env: ', '/* @echo ENV*/', '/*@echo CC.SECURE.INTER.HREF*/');
  // @endif

  // let ccAPI = '/*@echo CC.SECURE.INTER.HREF*/' + '/data/mus_ed_guide_config';
  let customVar = '/*@echo SOME_ENV*/';

  let cotApp = new CotApp();

  //@if ENV='local'
  cotApp.appContentKeySuffix = '';
  //@endif

  //CotModel extends Backbone.Model, to manage data models
  megModel = new CotModel({
    "recCreated": "",
    "recStatus": "",
    "District": "",
    "Notes": "",
    "MapAddr": "",
    "SiteURL": "",
    "SitePicName": "",
    "ProgramName": "",
    "ProgramNameSelect": "",
    "ProgramNameText": "",
    "Curriculum": "",
    "Grade": "",
    "PrimaryTopic": "",
    "SecTopic": "",
    "SecTopicSelect": "",
    "TerTopic": "",
    "TerTopicSelect": "",
    "NewTopic": "",
    "AdditionalCur": [],
    "Description": "",
    "BulletText1": "",
    "BulletText2": "",
    "BulletText3": "",
    "BulletText4": "",
    "Duration": "",
    "MinStudents": "",
    "MaxStudents": "",
    "PriceStudent": "",
    "PriceProgram": "",
    "Name": "",
    "Address": "",
    "Phone": "",
    "Email": "",
    "LunchOption": "",
    "OtherOptions": [],
    "Availability": [],
    "StartTime": "",
  });

  //You should use CotForm to create forms. The DemoForm class is an example that
  //uses a custom subclass of CotView, which extends Backbone.view, to manage a CotForm instance
  let thisForm = new MegForm({
    id: form_id,
    title: 'Museum Education Guide Profile',
    model: megModel
  });

  cotApp.loadAppContent({
    keys: ['mus_ed_guide_config'],
    onComplete: function (data) {
      let key = "mus_ed_guide_config";
      //@if ENV='local'
      config = JSON.parse(data[key]);
      //@endif
      //@if ENV!='local'
      config = data[key];
      //@endif

      //   thisForm.render($(app_container_id));
      //initForm();
      if (window['cot_app']) {
        const app = new cot_app(form_id);
        app.setBreadcrumb([
          { "name": form_id, "link": "#" }
        ]);
        app.render();
      }

      thisForm.render($(app_container_id));
      initForm();
    }
  });

  function initForm() {
    repo = config.default_repo ? config.default_repo : repo;

    imageDropzone = new Dropzone("div#uploadedFiles", $.extend(config.admin.imageDropzonePublic, {
      "dz_id": "uploadedFiles", "fid": fid, "form_id": form_id,
      "url": config.httpHost.app_public[httpHost] + config.api_public.upload + config.default_repo + '/' + repo,
    }))

    // prepares dz fields for AODA
    $(".dz-hidden-input").attr("aria-hidden", "true");
    $(".dz-hidden-input").attr("aria-label", "File Upload Control");

    $("#printbtn").click(function () { window.print(); });
  }

});
