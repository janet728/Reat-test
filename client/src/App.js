import React, { Component } from 'react';
import Amounts from './components/amount/Amounts';
import AmountAdd from './components/amount/AmountAdd';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 1080
  },
  progess: {
    margin: theme.spacing(2),
  }
});

class App extends Component {

  state = {
    amounts: '',
    completed: 0
  }

  componentDidMount() {
    console.log('state start')
    this.timer = setInterval(this.progess, 20);
    this.callApi()
    .then(res => this.setState({amounts: res}))
    .catch(err => console.log(err));
    console.log('state', this.state)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  callApi = async() => {
    const response = await fetch('/api/amounts');
    const body = await response.json();
    console.log('body', body)
    return body;
  }

  progess = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1})
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>결제일</TableCell>
                <TableCell>카테고리</TableCell>
                <TableCell>내역</TableCell>
                <TableCell>금액</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.amounts ? this.state.amounts.map(c => {
                return <Amounts key={c.id} id={c.id} usedAt={c.usedAt} categoryId={c.categoryId} content={c.content} amount={c.amount} createdAt={c.createdAt} />
              }) : 
              <TableRow>
                <TableCell colSpan="6" align="center">
                  <CircularProgress className={classes.progess} variant="determinate" value={this.state.completed} />
                </TableCell>
              </TableRow>
              }
            </TableBody>
          </Table>
        </Paper>
        <AmountAdd/>
      </div>
    )
  }
}

export default withStyles(styles)(App);
