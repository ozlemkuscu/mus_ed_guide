let MegForm = CotView.extend({
  initialize: function () {
  },
  render: function (container) {
    container.append(this.el);
    this._form = new CotForm(this.formDefinition());
    this._form.render({ target: this.el });
    this._form.setModel(this.model);
    return this;
  },
  formDefinition: function () {
    let _this = this;
    return {
      id: this.id,
      title: this.title,
      rootPath: "/*@echo SRC_PATH*//", //only required for forms using validationtype=Phone fields
      // success: function () { bootbox.alert('Form submitted!'); return false; },
      success: function success() {
        let payload = megModel.toJSON();
        app_api_url = "https://was-intra-sit.toronto.ca/c3api_data/v2/DataAccess.svc/mus_ed_guide/submissions";

        let dataCreated = new Date();
        payload.recCreated = dataCreated;
        payload.Status = config.status.DraftApp;

        // Gets all the info for uploads to payroll
        payload.uploadedFiles = processUploads(imageDropzone, repo, false);

        let uploads = (payload.uploadedFiles);
        let keepQueryString = checkFileUploads(uploads);
/*
        let data = payload;

        httpPOST(payload, function (data, textStatus, jqXHR) {
          // SUCCESS
          const id = jqXHR.getResponseHeader('OData-EntityID'); // Get new ID
          megModel.set("id", id); // Add ID to model
          if ((data.EventMessageResponse.Response.StatusCode) == 200) {
            scroll(0, 0);
            $(app_container_id).html(config.messages.submit.done);
          }
        }, function (jqXHR, textStatus, errorThrown) {
          // ERROR
          $('#successFailArea').html(config.messages.submit.fail);
          alert('Error occured, ' + errorThrown)
        })
*/
payload.vAppStatus = "New";

        $.ajax({
          //url: config.httpHost.app_public[httpHost] + config.api_public.post + repo + '?sid=' + keepQueryString,
          url: config.httpHost.app_public['/* @echo ENV*/'] + config.api_public.post +config.default_repo+"/SchoolTrips"+ keepQueryString,
          type: "POST",
          data: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json; charset=utf-8;',
            'Cache-Control': 'no-cache'
          },
          "datatype": "json",
          "success": function (data) {
          //  if ((data.EventMessageResponse.Response.StatusCode) == 200) {
              scroll(0, 0);
              $(app_container_id).html(config.messages.submit.done);
          //  }
          },
          "error": function () {
            $('#successFailArea').html(config.messages.submit.fail);
            bootbox.alert(config.messages.submit.fail);
          }
        }).done(function () {
        });
      },
      useBinding: true,
      sections: getSubmissionSections()
    }
  }
});
function httpPOST(data, success, error) {
  $.ajax(app_api_url, {
    data: JSON.stringify(data),
    error: error,
    method: "POST",
    success: success
  });
}
function getSubmissionSections() {
  let section = [
    {
      id: "program_section",
      title: config["Program Section"],
      rows: [
        {
          fields: [
            { id: "ProgramNameSelect", bindTo: "ProgramNameSelect", title: config["ProgramNameSelect"], type: "dropdown", choices: config["ProgramName"].choices, className: "col-xs-12 col-md-6", required: requiredFlag },
            { id: "ProgramNameText", bindTo: "ProgramNameText", title: config["ProgramNameText"], className: "col-xs-12 col-md-6" }
          ]
        },
        {
          fields: [
            { id: "Curriculum", bindTo: "Curriculum", title: config["Curriculum"].title, type: "dropdown", choices: config["Curriculum"].choices, required: requiredFlag },
            { id: "Grade", bindTo: "Grade", title: config["Grade"].title, type: "dropdown", choices: config["Grade"].choices, required: requiredFlag }
          ]
        },
        {
          fields: [
            { id: "PrimaryTopic", bindTo: "PrimaryTopic", title: config["PrimaryTopic"].title, type: "dropdown", choices: config["PrimaryTopic"].choices, required: requiredFlag },
          ]
        },
        {
          fields: [
            { id: "SecTopicSelect", bindTo: "SecTopicSelect", title: config["Secondary Topic"], type: "dropdown", choices: config["AdditionalTopic"].choices, required: requiredFlag, className: "col-xs-12 col-md-4" },
            { id: "TerTopicSelect", bindTo: "TerTopicSelect", title: config["Tertiary Topic"], type: "dropdown", choices: config["AdditionalTopic"].choices, required: requiredFlag, className: "col-xs-12 col-md-4" },
            { id: "NewTopic", bindTo: "NewTopic", title: config["New Topic"], className: "col-xs-12 col-md-4" }
          ]
        },
        {
          fields: [
            {
              id: "AdditionalCur", bindTo: "AdditionalCur", title: config["AdditionalCurriculum"].title, type: "checkbox", choices: config["AdditionalCurriculum"].choices, orientation: "horizontal"
            }
          ]
        },
        {
          fields: [
            {
              id: "Description", bindTo: "Description", title: config["Description"], prehelptext: config["DescriptionText"],
              type: "textarea", orientation: "horizontal", cols: "50", rows: "3", htmlAttr: { maxLength: 500 }, required: requiredFlag
            }]
        }, {
          fields: [
            {
              id: "BulletText1", bindTo: "BulletText1", title: config["Bullet Text 1"], type: "textarea", orientation: "horizontal", cols: "50", rows: "3"
            }]
        }, {
          fields: [
            {
              id: "BulletText2", bindTo: "BulletText2", title: config["Bullet Text 2"], type: "textarea", orientation: "horizontal", cols: "50", rows: "3"
            }]
        }, {
          fields: [
            {
              id: "BulletText3", bindTo: "BulletText3", title: config["Bullet Text 3"], type: "textarea", orientation: "horizontal", cols: "50", rows: "3"
            }]
        }, {
          fields: [
            {
              id: "BulletText4", bindTo: "BulletText4", title: config["Bullet Text 4"], type: "textarea", orientation: "horizontal", cols: "50", rows: "3"
            }]
        },
        {
          fields: [
            {
              id: "Duration", bindTo: "Duration", title: config["Duration"].title, type: "dropdown", choices: config["Duration"].choices, required: requiredFlag
            }
          ]
        },
        {
          fields: [
            {
              id: "MinStudents", bindTo: "MinStudents", title: config["MinStudents"], validationtype: "number", required: requiredFlag, className: "col-xs-12 col-md-3",
              validators: {
                integer: {
                  message: "This field must be a valid integer."
                }
              }
            },
            {
              id: "MaxStudents", bindTo: "MaxStudents", title: config["MaxStudents"], validationtype: "number", required: requiredFlag, className: "col-xs-12 col-md-3",
              validators: {
                integer: {
                  message: "This field must be a valid integer."
                }
              }
            },
            {
              id: "PriceStudent", bindTo: "PriceStudent", title: config["PriceStudent"], validationtype: "currency", required: requiredFlag, className: "col-xs-12 col-md-3",
              validators: {
                numeric: {
                  message: "This field must be a valid number."
                }
              }
            },
            {
              id: "PriceProgram", bindTo: "PriceProgram", title: config["PriceProgram"], validationtype: "currency", required: requiredFlag, className: "col-xs-12 col-md-3",
              validators: {
                numeric: {
                  message: "This field must be a valid number."
                }
              }
            }
          ] // closing fields
        }] // closing rows
    },
    {
      "id": "site_section",
      "title": config["Site Section"],
      "className": "panel-info",
      "rows": [
        {
          "fields": [
            { id: "SiteName", bindTo: "SiteName", title: config["SiteName"].title, type: "dropdown", choices: config["SiteName"].choices, required: requiredFlag },

          ]
        },
        {
          "fields": [
            {
              id: "LunchOption", bindTo: "LunchOption", title: config["LunchOption"].title, type: "radio", choices: config["LunchOption"].choices, orientation: "horizontal", required: requiredFlag
            }
          ]
        },
        {
          "fields": [
            {
              id: "OtherOptions", bindTo: "OtherOptions", title: config["OtherOptions"].title, type: "checkbox", choices: config["OtherOptions"].choices, orientation: "vertical", required: requiredFlag
            }
          ]
        },
        {
          "fields": [
            {
              id: "Availability", bindTo: "Availability", title: config["Availability"].title, type: "checkbox", choices: config["Availability"].choices, orientation: "vertical", required: requiredFlag
            }
          ]
        },
        {
          "fields": [
            {
              id: "StartTime", bindTo: "StartTime", title: config["StartTime"].title, type: "radio", choices: config["StartTime"].choices, orientation: "horizontal", required: requiredFlag
            }
          ]
        }
      ]
    },
    {
      "id": "imageSec",
      "title": config["Attachments Section"],
      "className": "panel-info",
      "rows": [
        {
          "fields": [
            {
              "id": "ProgramPhoto", "prehelptext": config["Program Photo Text"], "title": config["Program Photo"], "type": "html",
              "aria-label": "Dropzone File Upload Control Field for Images",
              "html": "<section aria-label='File Upload Control Field for Images' id='image_attachments'> <div class='dropzone' id='uploadedFiles' aria-label='Dropzone File Upload Control for Images Section'></div></section>", "className": "col-xs-12 col-md-12"
            },
            { "id": "submitHelp", "title": "", "type": "html", "html": config["SubmitText"], "className": "col-xs-12 col-md-12" },
            {
              "id": "actionBar",
              "type": "html",
              "html": `<div className="col-xs-12 col-md-12"><button class="btn btn-success" id="savebtn"><span class="glyphicon glyphicon-send" aria-hidden="true"></span> ` + config.button.submitReport + `</button>
                         <button class="btn btn-success" id="printbtn"><span class="glyphicon glyphicon-print" aria-hidden="true"></span>Print</button></div>`
            },
            { "id": "successFailRow", "type": "html", "className": "col-xs-12 col-md-12", "html": `<div id="successFailArea" className="col-xs-12 col-md-12"></div>` },
            { "id": "fid", "type": "html", "html": "<input type=\"text\" id=\"fid\" aria-label=\"Document ID\" aria-hidden=\"true\" name=\"fid\">", class: "hidden" },
            { "id": "action", "type": "html", "html": "<input type=\"text\" id=\"action\" aria-label=\"Action\" aria-hidden=\"true\" name=\"action\">", class: "hidden" },
            { "id": "createdBy", "type": "html", "html": "<input type=\"text\" id=\"createdBy\" aria-label=\"Record Created By\" aria-hidden=\"true\" name=\"createdBy\">", class: "hidden" },
            { "id": "recCreated", "type": "html", "html": "<input type=\"text\" id=\"recCreated\" aria-label=\"Record Creation Date\" aria-hidden=\"true\" name=\"recCreated\">", class: "hidden" },
            { "id": "Status", "type": "html", "html": "<input type=\"hidden\" aria-label=\"Record Status\" aria-hidden=\"true\" id=\"lstStatus\" name=\"lstStatus\">", class: "hidden" }
          ]
        }
      ]
    }
  ]
  return section;
}
function processUploads(DZ, repo, sync) {
  let uploadFiles = DZ.existingUploads ? DZ.existingUploads : new Array;
  let _files = DZ.getFilesWithStatus(Dropzone.SUCCESS);
  let syncFiles = sync;
  if (_files.length == 0) {
    //empty
  } else {
    $.each(_files, function (i, row) {
      let json = JSON.parse(row.xhr.response);
      json.name = row.name;
      json.type = row.type;
      json.size = row.size;
      json.bin_id = json.BIN_ID[0];
      delete json.BIN_ID;
      uploadFiles.push(json);
      syncFiles ? '' : '';
    });
  }
  return uploadFiles;
}
function checkFileUploads(uploads) {
  let queryString = "";
  let binLoc = "";

  if (uploads.length > 0) {
    $.each(uploads, function (index, item) {
      if (binLoc == "") {
        binLoc = item.bin_id;
      } else {
        binLoc = binLoc + "," + item.bin_id;
      }
    })
  }

  if (binLoc != "") { queryString = "&keepFiles=" + binLoc };

  return queryString;
}