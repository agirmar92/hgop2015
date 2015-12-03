HGOP - Test Examples
==========
Commands/events
* Place/Placed(row, column, icon)
* Error(error_message)
* Finished(winning_message)

# Illegal moves
#### Move chosen that has already been chosen
| State | Commands/events         |
|-------|-------------------------|
| Given | [ Placed(0,0,x) ]       |
| When  | [ Place(0,0,o) ]        |
| Then  | [ Error(illegal Move) ] |

#### Move chosen that is outside the grid
| State | Commands/events         |
|-------|-------------------------|
| When  | [ Place(5,0,o) ]        |
| Then  | [ Error(illegal Move) ] |

# Winning scenarios
#### Diagonal win
| State | Commands/events                  |
|-------|----------------------------------|
| Given | [ Placed(0,0,x), Placed(1,1,x) ] |
| When  | [ Place(2,2,x) ]                 |
| Then  | [ Finished(x wins) ]             |

#### Horizontal win
| State | Commands/events                  |
|-------|----------------------------------|
| Given | [ Placed(1,0,x), Placed(1,1,x) ] |
| When  | [ Place(1,2,x) ]                 |
| Then  | [ Finished(x wins) ]             |

#### Vertical win
| State | Commands/events                  |
|-------|----------------------------------|
| Given | [ Placed(0,1,o), Placed(1,1,o) ] |
| When  | [ Place(2,1,o) ]                 |
| Then  | [ Finished(o wins) ]             |

# Draw scenarios
#### Board filled with no winner
| State | Commands/events                                                                                                            |
|-------|----------------------------------------------------------------------------------------------------------------------------|
| Given | [ Placed(1,1,x), Placed(0,2,o), Placed(1,0,x), Placed(1,2,o), Placed(2,2,x), Placed(0,0,o), Placed(0,1,x), Placed(2,1,o) ] |
| When  | [ Place(2,0,x) ]                                                                                                           |
| Then  | [ Finished(draw) ]                                                                                                         |
