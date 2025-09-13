--------------------------------------------VIDEO STREAMING WEBSITE API DOCUMENTATIONS -------------------------------------




1. Upload Video on server: 

endponts: http://localhost:5000/upload
body: formData (key: 'file') (value: 'video.mp4' or, 'video.mp3')
method: POST

2. Get all Videos from server: 

endponts: http://localhost:5000/videos
body: none
method: GET


2. Get single Video from server by lessonId: 

endponts: http://localhost:5000/videos/61cf30bc-cf7f-4f6b-971d-410b322873a1
body: none
params: lessonId
method: GET


2. Delete single Video from server by lessonId: 

endponts: http://localhost:5000/videos/61cf30bc-cf7f-4f6b-971d-410b322873a1
body: none
params: lessonId
method: DELETE

