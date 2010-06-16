Attribute VB_Name = "modMain"
'
' Save this module to
' C:\Documents and Settings\<user>\Application Data\Microsoft\Excel\XLSTART\Personal.xls
'
Option Explicit

Private Const SEVENZIP_PATH     As String = "C:\Program Files\7-Zip\7z.exe"
Private Const WIDGET_PATH       As String = "C:\Qt\MyProjects\SimpleFlashCards"
Private Const WIDGET_FOLDER     As String = "SimpleFlashCards"
Private Const WIDGET_FILENAME   As String = "SimpleFlashCards.wgz"

'
' This function requires the following files
' (WIDGET_FOLDER)\createwgz.bat      // batch file for creating wgz file
' (WIDGET_FOLDER)\SimpleFlashCards   // content of the widget
'
' Also 7-zip needs to be installed under SEVENZIP_PATH (see above)
'
Sub CreateFlashCardsWidget()
    
    If Dir(SEVENZIP_PATH) = "" Then
        Call MsgBox("7-zip is not installed!")
    End If
    
    If Dir(WIDGET_PATH, vbDirectory) <> "" Then
        
        ' get the output file path
        Dim strWgzFileName      As String
        Do
            strWgzFileName = Application.GetSaveAsFilename("SimpleFlashCards.wgz", "S60 WRT Widget (*.wgz),*.wgz", , "Save file as...")
            If CStr(strWgzFileName) <> "False" Then
                Dim strDir      As String
                strDir = Dir(strWgzFileName)
                If strDir <> "" Then    ' same file name already exists
                    If MsgBox("Overwrite existing file?", vbOKCancel + vbQuestion) = vbCancel Then
                        Exit Sub    ' user doesn't want to overwrite -> cancel
                    Else
                        Exit Do     ' ok to overwrite -> proceed
                    End If
                Else
                    Exit Do      ' no need to overwrite -> proceed
                End If
            Else
                Exit Sub    ' canceled
            End If
        Loop
        
        Dim strFileName As String
        strFileName = WIDGET_PATH + "\" + WIDGET_FOLDER + "\data.js"
        
        Dim fso         As Object
        ' open the output stream
        Set fso = CreateObject("ADODB.Stream")
        fso.Type = 2
        fso.Charset = "utf-8"
        Call fso.Open
        
        ' write the data
        Call fso.writeText(MakeExportData)
        
        ' save the file and close
        Call fso.saveToFile(strFileName, 2)
        Call fso.Close
        
        ' run the batch file to create .wgz file
        Dim strCurDir   As String
        strCurDir = CurDir
        Call ChDrive(Left(WIDGET_PATH, 2))
        Call ChDir(WIDGET_PATH)
        Call Shell("CMD.EXE /C " + WIDGET_PATH + "\createwgz.bat", vbHide)
        Call ChDrive(Left(strCurDir, 2))
        Call ChDir(strCurDir)
                
        ' wait for a while for the shell command to be completed
        Dim waitTime As Variant
        waitTime = Now + TimeValue("0:00:04")
        Call Application.Wait(waitTime)
        
        ' copy the file
        Call FileCopy(WIDGET_PATH + "\" + WIDGET_FILENAME, strWgzFileName)
        
    End If

End Sub

Private Function formatEntry(str As String) As String
Dim ret     As String

    ret = str
    ret = Replace(ret, Chr(34), "\" + Chr(34))      ' escape couble quote
    ret = Replace(ret, vbCrLf, "<br>")              ' replace CRLF
    ret = Replace(ret, vbCr, "<br>")                ' replace CR
    ret = Replace(ret, vbLf, "<br>")                ' replace LF
    ret = Chr(34) + ret + Chr(34)                   ' add double quotes
    
    formatEntry = ret

End Function

Private Function MakeExportData() As String
Dim strRet          As String
Dim intSheetsCount  As Integer
Dim i               As Integer
Dim index           As Integer
    
    strRet = strRet + "var FlashCardCollection = new Array();" + vbCrLf
    strRet = strRet + "var FlashCardCollectionNames = new Array();" + vbCrLf + vbCrLf
    
    intSheetsCount = ActiveWorkbook.Sheets.Count
    index = 0
    For i = 1 To intSheetsCount
        
        Dim sht As Worksheet
        Set sht = ActiveWorkbook.Sheets(i)
        
        If InStr(sht.Name, "ignore") = 0 Then
            strRet = strRet + "FlashCardCollectionNames[" + CStr(index) + "] = '" + sht.Name + "';" + vbCrLf
            strRet = strRet + "FlashCardCollection[" + CStr(index) + "] = [" + vbCrLf
            
            Dim r   As Integer
            r = 1
            Do
                If sht.Range("A" + CStr(r)).Value = "" Then
                    Exit Do
                End If
                strRet = strRet + _
                    IIf(r = 1, "", ",") + "[" + _
                    formatEntry(sht.Range("A" + CStr(r)).Value) + "," + _
                    formatEntry(sht.Range("B" + CStr(r)).Value) + "," + _
                    formatEntry(sht.Range("C" + CStr(r)).Value) + "]" + vbCrLf
                r = r + 1
            Loop
            strRet = strRet + "];" + vbCrLf + vbCrLf
            
            index = index + 1
        End If
    
    Next
    
    MakeExportData = strRet
    
End Function

