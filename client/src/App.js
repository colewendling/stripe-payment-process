import {BrowserRouter as Switch, Route} from 'react-router-dom'
import Form from "./Form";
import './Form.css'

const App = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Form />
      </Route>
    </Switch>
  )
}

export default App;
