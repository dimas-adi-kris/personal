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

function convertTZ(date, tzString) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
}

function convertToDateTime(date) {
  return (new Date(convertToTimestamp(date)).toISOString()).slice(0, -1)
}

function convertToTimestamp(date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
    date.getUTCDate(), date.getUTCHours(),
    date.getUTCMinutes(), date.getUTCSeconds())
}

function updateSessionStorageFromCollection(collection) {
  collection.getAll().then(function (data) {
    sessionStorage.setItem(collection.collection_name, JSON.stringify(data));
  })
}

export {
  bsAlert, actionButtons, convertTZ,
  convertToDateTime, convertToTimestamp,
  updateSessionStorageFromCollection
}