function bsAlert(title, message, type) {
    return `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
    <strong>${title}</strong> ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`
    
}

function actionButtons() {
    return `
    <div class="col">
      <a href="#" id="submit" class="btn btn-primary">Submit</a>
    </div>
    `
}