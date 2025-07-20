
function Search({searchTerm,setSearchTerm}) {
  return (
    <div className='search'>
     <div>
      <img src="search.svg" alt="search"></img>
      <input type="text" placeholder="Search Movie Throughout thosands of movie"
      value={searchTerm}
      onChange={(event)=>setSearchTerm(event.target.value)}
      >
       
      </input>
      </div> 
    </div>
  )
}

export default Search
