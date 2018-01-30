$("#hide_courses").change(function() {
	checked = $(this).is(":checked");
	chrome.storage.sync.set({"hideCourses": checked});
});

$("#theme_color").change(function()
{

	themeColor = $(this).val();
	$(".header").css("background-color", themeColor);
	chrome.storage.sync.set({"themeColor": themeColor});

});

$("#reset").click(function()
{
	themeColor = "#697854";
	$(".header").css("background-color", themeColor);
	$("#theme_color").val(themeColor);
	chrome.storage.sync.set({"themeColor": themeColor});

});

function saveCourseList()
{
	courseList = [];
	$(".course_input").each(function() {
		text = $(this).val().trim();
		if(text != "")
			courseList.push($(this).val());
	});

	console.log("saving course list");
	chrome.storage.sync.set({"courseList": courseList});

}

function updateCourseInput()
{
	$(".course_input").change(function(){
		saveCourseList();
	});

	$(".course_input").keypress(function(){
		saveCourseList();
	});


	$(".course_remove").click(function()
	{
		$(this).prev(".course_input").remove();
		$(this).remove();
		saveCourseList();

	});

}

$("#course_add").click(function()
{
	$("#course_list").append('<input class="course_input" type="text" placeholder="Some Course"> <button class="course_remove">x</button>');
	updateCourseInput();
});

$(document).ready(function()
{
	chrome.storage.sync.get({
		hideCourses: false,
		themeColor: "#697854",
		courseList: []
	}, function(items) {
		$("#hide_courses").prop("checked", items.hideCourses);

		$(".header").css("background-color", items.themeColor);
		$("#theme_color").val(items.themeColor);

		for(key in items.courseList)
		{
			course = items.courseList[key];
			$("#course_list").append(`<input class="course_input" type="text" placeholder="Some Course" value="${course}"> <button class="course_remove">x</button>`);

		}
		updateCourseInput();

	});

});
