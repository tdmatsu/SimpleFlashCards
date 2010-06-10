set widgetname=SimpleFlashCards
del %widgetname%.wgz
del %widgetname%.zip
7z a %widgetname%.zip %widgetname%
rename %widgetname%.zip %widgetname%.wgz
