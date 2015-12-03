HGOP - Test Examples
==========
* Place/Placed(row, column, icon)
* Error(error_message)

# Illegal moves
#### Move chosen that has already been chosen
| State | Commands/events         |
|-------|-------------------------|
| Given | [ Placed(0,0,x) ]       |
| When  | [ Place(0,0,o) ]        |
| Then  | [ Error(Illegal Move) ] |

#### Move chosen that is outside the grid
| State | Commands/events         |
|-------|-------------------------|
| When  | [ Place(5,0,o) ]        |
| Then  | [ Error(Illegal Move) ] |

# Winning scenarios
blabla

# Draw scenarios
lakdlsdk
