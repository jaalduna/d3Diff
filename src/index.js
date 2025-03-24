// function to load a json file
asyncfunction loadJSON(file){
  try{
    const response = await fetch(file);
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    const data = await respose.json();
    console.log(data);
} catch (error){
    console.error('There has been a problem with your fetch operation:', error);
  }



loadJSON('data/precios_data.json.');
