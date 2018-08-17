document.addEventListener('DOMContentLoaded', ()=>{

  // 1. ADD PUPS TO DOG BAR
  // - make a fetch to get all of the pup objects
  // - add a span with the pup's name to the dog bar
  const dogBarDiv = document.getElementById('dog-bar')
  fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(dogs => renderDogNameSpan(dogs))

  const renderDogNameSpan = (dogs) => {
    dogs.forEach((dog)=>{
      let dogNameSpan = document.createElement('span')
      dogNameSpan.dataset.id = dog.id

      dogNameSpan.innerText = dog.name
      dogBarDiv.appendChild(dogNameSpan)
    })
  }

  const renderGoodDogNameSpan = (dogs) => {
    dogs.forEach((dog)=>{
      if(dog.isGoodDog === true) {
        let dogNameSpan = document.createElement('span')
        dogNameSpan.dataset.id = dog.id

        dogNameSpan.innerText = dog.name
        dogBarDiv.appendChild(dogNameSpan)

      }
    })
  }

  // 2. SHOW MORE INFO ABOUT EACH PUP
  // - When a user clicks on a pup's span in the dog bar,
  //  event delegation on dog bar
  //   that pup's info (image, name, and isGoodDog status) should show up in the div with the id of "dog-info"
  // dog info div should have the following children:
   // <img src=dog_image_url>
   // <h2>Mr. Bonkers</h2>
   // <button>Good Dog!</button>
  dogBarDiv.addEventListener('click', e=>{
    if(e.target.nodeName === "SPAN") {
      let dog_id = e.target.getAttribute('data-id')
      fetchDogInfo(dog_id)
    }
  })

  const fetchDogInfo = (dog_id)=> {
    fetch(`http://localhost:3000/pups/${dog_id}`)
      .then(res => res.json())
      .then(dog => appendDogInfo(dog))
  }

  const dogInfoDiv = document.getElementById('dog-info')
  const appendDogInfo = (dog) => {
    dogInfoDiv.dataset.id = dog.id
    dogInfoDiv.innerHTML = renderDogInfo(dog) + renderDogBtn(dog)
  }

  const renderDogInfo = (dog) => {
    return `<img src=${dog.image}>
            <h2>${dog.name}</h2>`
  }

  const renderDogBtn = (dog) => {
    if(dog.isGoodDog === true){
      return `<button>Bad Dog</button>`
    } else {
      return `<button>Good Dog!</button>`
    }
  }

  // 3. TOGGLE GOOD DOG
  // - button's text should change from Good to Bad or Bad to Good
  // - corresponding pup object in the database should be updated to reflect the new isGoodDog value
  // - update a dog by making a PATCH request to /pups/:id

  dogInfoDiv.addEventListener('click', e=>{
    let dog_id = e.target.parentElement.getAttribute('data-id')

    if (e.target.innerText === "Good Dog!") {
      let newValue = true
      e.target.innerText = "Bad Dog"
      patchRequest(dog_id, newValue)
    } else {
      let newValue = false
      e.target.innerText = "Good Dog!"
      patchRequest(dog_id, newValue)
    }

  })

  const patchRequest = (dog_id, newValue) =>{
    fetch(`http://localhost:3000/pups/${dog_id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isGoodDog: newValue
      })
    })
      .then(res => res.json())
      .then(console.log)
  }

  // 4. Bonus: FILTER GOOD DOGS
  // -The button's text should change from "Filter good dogs: OFF" to "Filter good dogs: ON", or vice versa.
  // -If the button now says "ON" (meaning the filter is on), then the Dog Bar should only show pups whose isGoodDog attribute is true. If the filter is off, the Dog Bar should show all pups (like normal).

  const goodDogFilterBtn = document.getElementById('good-dog-filter')
  goodDogFilterBtn.addEventListener('click', ()=> {
    if (goodDogFilterBtn.innerText === 'Filter good dogs: OFF') {
      // show good dogs
      goodDogFilterBtn.innerText = 'Filter good dogs: ON'
      dogBarDiv.innerHTML = ""
      fetch('http://localhost:3000/pups')
        .then(res => res.json())
        .then(dogs => renderGoodDogNameSpan(dogs))
    } else {
      // show all dogs
      goodDogFilterBtn.innerText = 'Filter good dogs: OFF'
      dogBarDiv.innerHTML = ""
      fetch('http://localhost:3000/pups')
        .then(res => res.json())
        .then(dogs => renderDogNameSpan(dogs))
    }
  })

})
