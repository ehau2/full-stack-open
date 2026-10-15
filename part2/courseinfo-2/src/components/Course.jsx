const Header = ({ name }) => {
    return (
        <h1>{name}</h1>
    )
}

const Content = ({ parts }) => (
    <div>
        {parts.map(part =>
            <Part key={part.name} part={part} />
        )}
    </div>
)

const Part = ({ part }) => (
    <p>{part.name} {part.exercises}</p>
)

const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return <b>Total of exercises: {total}</b>
}

const Course = ({ course }) => {
    return <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
}

export default Course