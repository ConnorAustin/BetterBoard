// Saves options to chrome.storage
function save_options() {
  var course_list = document.getElementById('course_list').value;
  chrome.storage.sync.set({
    courseList: course_list,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    courseList: '',
  }, function(items) {
    document.getElementById('course_list').value = items.courseList;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
