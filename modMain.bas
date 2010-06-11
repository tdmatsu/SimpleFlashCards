Attribute VB_Name = "modMain"
'
' Save this module to
' C:\Documents and Settings\<user>\Application Data\Microsoft\Excel\XLSTART\Personal.xls
'

Option Explicit

'
' Create FlashCards as single HTML file
'
Sub CreateSingleHtml()

Dim fso         As Object
Dim strFileName As String
    
    Do
        strFileName = Application.GetSaveAsFilename("flashcards.html", "HTML File (*.html),*.html", , "Save file as...")
        If CStr(strFileName) <> "False" Then
            Dim strDir      As String
            strDir = Dir(strFileName)
            If strDir <> "" Then
                If MsgBox("Overwrite existing file?", vbOKCancel + vbQuestion) = vbCancel Then
                    Exit Sub    ' cancel
                Else
                    Exit Do     ' proceed
                End If
            Else
                Exit Do      ' proceed
            End If
        Else
            Exit Sub    ' cancel
        End If
    Loop

Dim shtHtml As Worksheet
Dim strHtml As String

    Set shtHtml = ThisWorkbook.Sheets("html")
    
    Debug.Print shtHtml.Name
    strHtml = shtHtml.Range("A1").Value + MakeExportData + shtHtml.Range("A2").Value

    ' open the output stream
    Set fso = CreateObject("ADODB.Stream")
    fso.Type = 2
    fso.Charset = "utf-8"
    Call fso.Open

    ' write the data
    Call fso.writeText(strHtml)

    ' save the file and close
    Call fso.saveToFile(strFileName, 2)
    Call fso.Close

    Call MsgBox("Completed!!", vbInformation)


End Sub



Sub CreateDataJs()
Dim fso         As Object
Dim strFileName As String

    Do
        strFileName = Application.GetSaveAsFilename("data.js", , , "Save file as...")
        If CStr(strFileName) <> "False" Then
            Dim strDir      As String
            strDir = Dir(strFileName)
            If strDir <> "" Then
                If MsgBox("Overwrite existing file?", vbOKCancel + vbQuestion) = vbCancel Then
                    Exit Sub    ' cancel
                Else
                    Exit Do     ' proceed
                End If
            Else
                Exit Do      ' proceed
            End If
        Else
            Exit Sub    ' cancel
        End If
    Loop
    
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
    
    Call MsgBox("Completed!!", vbInformation)

End Sub

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
                Dim strWrk      As String
                strWrk = sht.Range("A" + CStr(r)).Value + "\t" + sht.Range("B" + CStr(r)).Value
                strWrk = Replace(strWrk, Chr(34), "\" + Chr(34))
                strRet = strRet + IIf(r = 1, "", ",") + Chr(34) + strWrk + Chr(34) + vbCrLf
                r = r + 1
            Loop
            strRet = strRet + "];" + vbCrLf + vbCrLf
            
            index = index + 1
        End If
    
    Next
    
    MakeExportData = strRet
    
End Function
