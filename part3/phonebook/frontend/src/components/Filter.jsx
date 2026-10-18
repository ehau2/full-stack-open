const Filter = ({ filter, setFilter }) => {

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    return (
        <div>
            <h2>Filter</h2>
            <input placeholder="Search by name..." value={filter} onChange={handleFilterChange} />
        </div>
    )
}

export default Filter