import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Chart from 'chart.js/auto';

function App() {
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('https://retoolapi.dev/gDa8uC/data')
      .then(response => response.json())
      .then(xAxisData => {
        fetch('https://retoolapi.dev/o5zMs5/data')
          .then(response => response.json())
          .then(yAxisData => {
            const combinedData = [];

            const yItemWithID1 = yAxisData.find(item => item.id === 1);
            if (yItemWithID1) {
              combinedData.push({
                x: 0,
                y: parseFloat(yItemWithID1.RandomNumber)
              });
            } else {
              combinedData.push({ x: 0, y: 0 });
            }

            xAxisData.forEach(xItem => {
              const matchingYItem = yAxisData.find(yItem => yItem.id === xItem.id);

              if (matchingYItem) {
                combinedData.push({
                  x: parseFloat(xItem.RandomNumber),
                  y: parseFloat(matchingYItem.RandomNumber)
                });
              } else {
                combinedData.push({
                  x: parseFloat(xItem.RandomNumber),
                  y: 0
                });
              }
            });

            setChartData(combinedData.slice(0, 50)); 
          })
          .catch(error => console.error('Error fetching y-axis data:', error));
      })
      .catch(error => console.error('Error fetching x-axis data:', error));
  };

  useEffect(() => {
    if (chartData.length > 0) {
      renderChart();
    }
  }, [chartData]);

  const renderChart = () => {
    if (chartRef.current !== null) {
      chartRef.current.destroy(); 
    }

    const ctx = document.getElementById('myChart');

    chartRef.current = new Chart(ctx, {
      type: 'line', 
      data: {
        labels: chartData.map(item => item.x), 
        datasets: [{
          label: 'Y-Axis Data',
          data: chartData.map(item => item.y),
          fill: false,
          borderColor: 'rgba(54, 162, 235, 1)', 
          tension: 0.1 
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'X-Axis Data'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Y-Axis Data'
            },
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div className="App">
      <h1>Chart</h1>
      <canvas id="myChart"></canvas>
    </div>
  );
}

export default App;
