const Header = (props) => {
    return (
        <h1>{props.course.name}</h1>
    )
}

const Content = (props) => {
    console.log(props)

    return (
        <div>
            <Part title={props.exercises[0].name} count={props.exercises[0].exercises} />
            <Part title={props.exercises[1].name} count={props.exercises[1].exercises} />
            <Part title={props.exercises[2].name} count={props.exercises[2].exercises} />
        </div>
    )
}

const Part = (props) => {
    return (
        <p>{props.title} {props.count}</p>
    )
}

const Total = (props) => {
    return (
        <p>
            Number of exercises {
                props.exercises[0].exercises +
                props.exercises[1].exercises +
                props.exercises[2].exercises
            }
        </p>
    )
}

const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },
            {
                name: 'State of a component',
                exercises: 14
            }
        ]
    }

    return (
        <div>
            <Header course={course} />
            <Content exercises={course.parts} />
            <Total exercises={course.parts} />
        </div>
    )
}

export default App