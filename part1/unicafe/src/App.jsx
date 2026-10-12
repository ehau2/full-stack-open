import { useState } from 'react'

const Button = (props) => {
    return (
        <button onClick={props.onClick}>
            {props.text}
        </button>
    )
}

const Header = (props) => {
    return (
        <h1>{props.title}</h1>
    )
}

const StatisticLine = (props) => {
    return (
        <tr>
            <td>{props.label}</td>
            <td>{props.value}</td>
        </tr>
    )
}

const Statistics = (props) => {
    const all = props.good + props.neutral + props.bad
    const average = all === 0 ? 0 : (props.good - props.bad) / all
    const positive = all === 0 ? 0 : (props.good / all) * 100
    const hasFeedback = (props.good + props.neutral + props.bad) > 0

    if (hasFeedback) {
        return (
            <table>
                <StatisticLine label={"good"} value={props.good}></StatisticLine>
                <StatisticLine label={"neutral"} value={props.neutral}></StatisticLine>
                <StatisticLine label={"bad"} value={props.bad}></StatisticLine>
                <StatisticLine label={"all"} value={all}></StatisticLine>
                <StatisticLine label={"average"} value={average}></StatisticLine>
                <StatisticLine label={"positive"} value={positive}></StatisticLine>
            </table>
        )
    }
    else {
        return (
            <p>No feedback given</p>
        )
    }

}

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <Header title="give feedback"></Header>
            <Button text="good" onClick={() => setGood(good + 1)}></Button>
            <Button text="neutral" onClick={() => setNeutral(neutral + 1)}></Button>
            <Button text="bad" onClick={() => setBad(bad + 1)}></Button>
            <Header title="statistics"></Header>
            <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
        </div>
    )
}

export default App