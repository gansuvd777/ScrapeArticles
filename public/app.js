// Save article 
$(document).on("click", ".save-article", function (event) {
    var thisId = $(this).attr("data-id")
    $(this).hide();
  
    let data = {
      title: $("#title-" + thisId).text(),
      link: $("#link-" + thisId).text(),
      img: $("#img-" + thisId).text(),
      isSaved: true
    }
    $.ajax({
      method: "POST",
      url: "/saved",
      data: data,
      dataType: "json"
    }).then(function () {
    })
  })
  // Delete saved article
  $(document).on("click", ".delete-article", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    $.ajax({
      method: "DELETE",
      url: "/saved/" + thisId
    })
      .then(data => {
        // console.log(data);
        location.reload();
      });
  });
  
  $(document).on("click", ".note-article", function () {
    $(".modal-title").empty();
    $(".modal-body").empty();
    var thisId = $(this).attr("data-id");
  
    // Ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(data => {
        $(".modal-title").append(data.title);
        $(".modal-body").append("<div><textarea id='bodyinput' rows='6' name='body' style='min-width: 100%;'></textarea></div> <hr>");
        $(".modal-footer").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-warning btn-sm' style='margin-top:20px;'data-dismiss='modal'>Save Note</button>");
  
        if (data.note) {
          for ( var i = 0; i < data.note.length; i++) {
            $(".modal-body").append("<li class= 'list-group-item'><p>" + data.note[i].body + "</p><button data-id='" + data.note[i]._id + "'class= 'delete-note btn btn-danger'>X</button></li> <hr>");
          }
        }
      });
  });
  
  // Save the Note 
  $(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");
  
    // POST request to change the Note
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        body: $("#bodyinput").val()
      }
    })
      .then(data => {
        $("#bodyinput").empty();
        $(".modal-footer").empty()
      });
  })

  // Delete the Note 
  $(document).on("click", ".delete-note", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "DELETE",
      url: "/articles/" + thisId,
    })
      .then(remove => {
        location.reload();
      });
  })