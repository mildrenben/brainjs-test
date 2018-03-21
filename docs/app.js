// Form

const formSection = document.querySelector('.form-section')
const resultsSection = document.querySelector('.results-section')
const buttons = [...document.querySelectorAll('.button')]
const colorSquare = document.querySelector('.color-square')

const COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'brown', 'purple', 'pink', 'black']

let savedData = []

function newForm () {
  console.log('savedData', savedData)
  // Random RGB
  const rand = {
    r: Math.round(Math.random() * 255),
    g: Math.round(Math.random() * 255),
    b: Math.round(Math.random() * 255)
  }

  colorSquare.style.background = `rgb(${rand.r}, ${rand.g}, ${rand.b})`

  for (let button of buttons) {
      button.onclick = () => {
        savedData.push(
          { 
            input: {
              r: rand.r / 255,
              g: rand.g / 255,
              b: rand.b / 255
            }, 
            output: { [button.textContent.toLowerCase()]: 1 }
          }
        )
        
        // Check if we have 2 results for each color
        const answersByName = savedData.reduce((acc, val) => {
          const colorName = Object.keys(val.output)[0]
          acc[colorName] = acc[colorName] + 1
          console.log(acc,colorName, acc[colorName])
          return acc
        }, COLORS.reduce((acc, val) => {
          acc[val] = 0
          return acc
        }, {}))
        
        const answersByNameVals = Object.values(answersByName)

        if (Math.min(...answersByNameVals) > 1) {
          resultsSection.style.display = 'block'
          formSection.style.display = 'none'
          trainNet()
        } else {
          newForm()
        }
      }
  }
}

newForm()


// Results

const picker = document.querySelector('input[type="color"]')
const header = document.querySelector('h1')
const details = document.querySelector('p')

let net = new brain.NeuralNetwork()

function trainNet () {
  net.train(savedData)
}

function calculate() {
  const rgb = hexToRgb(picker.value)
  const output = net.run({
    r: rgb.r / 255,
    g: rgb.g / 255,
    b: rgb.b / 255
  })
  const dominant = getDominantColor(output)
  console.log('CALCULATING', savedData, picker.value, {
    r: rgb.r / 255,
    g: rgb.g / 255,
    b: rgb.b / 255
  }, output)
  header.textContent = `I think this color is ${dominant.name}`
  details.textContent = JSON.stringify(output)
}

picker.addEventListener('change', throttle(calculate, 500, {leading: true, trailing: true}))

