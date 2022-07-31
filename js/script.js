const drawChart = async () => {
  const width = 900;
  const height = 500;
  const margin = { top: 30, right: 20, bottom: 50, left: 50 };
  let year = +d3.select("#years").property("value");

  const data = await d3.json("./data/data.json");

  let formattedData = data
    .filter((d) => +d.year === year)
    .map((year) => {
      return {
        year: year.year,
        countries: year.countries.filter(
          (d) => d.income !== null && d.life_exp !== null
        ),
      };
    });

  let selectedData = formattedData
    .map((year) => {
      return year.countries.map((country) => {
        return {
          country: country.country,
          income: country.income,
          life_exp: country.life_exp,
        };
      });
    })
    .flat();

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("border", "1px solid #ccc")
    .style("border-radius", "5px")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const tooltip = d3
    .select(".tooltip")
    .style("opacity", 0)
    .style("display", "hidden")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("pointer-events", "none");

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(selectedData, (d) => d.income))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(selectedData, (d) => d.life_exp)])
    .range([height, 0]);

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("fill", "#ccc");

  svg
    .append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("fill", "#ccc");

  d3.selectAll(".tick line").style("stroke", "#ccc");
  d3.selectAll(".domain").style("stroke", "#ccc");

  //CHART TITLE
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .text("Life Expectancy vs. Income");

  svg
    .append("text")
    .attr("class", "year-label")
    .attr("x", width - margin.right)
    .attr("y", height - margin.bottom / 4)
    .attr("text-anchor", "end")
    .style("font-size", "32px")
    .style("fill", "#ccc")
    .text(`${year}`);

  // y axis label
  svg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Life Expectancy (Years)");

  // x axis label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 10)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("GDP Per Capita ($)");

  // draw the scatterplot
  svg
    .selectAll("circle")
    .data(selectedData)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.income))
    .attr("cy", (d) => yScale(d.life_exp))
    .attr("r", 5)
    .attr("fill", "steelblue")
    .style("cursor", "pointer")
    .on("mouseenter", (e, d) => {
      tooltip
        .transition()
        .duration(50)
        .style("opacity", 1)
        .style("display", "block")
        .style("left", `${e.pageX + 20}px`)
        .style("top", `${e.pageY}px`);

      tooltip.html(`
        <p>Country: ${d.country}</p>
        <p>Income: $${d.income}</p>
        <p>Life Exp.: ${d.life_exp}</p>`);
    })
    .on("mouseout", (e, d) => {
      tooltip
        .transition()
        .duration(120)
        .style("opacity", 0)
        .style("display", "none");
    });
  const annotation_one = [
    {
      note: {
        label:
          "At the beginning of 19th century, Netherlands had the highest GDP per capita with $4235 and relatively high life expectancy at age 39.86. Countries with lower GDP per capita tended to have lower life expectancy. For example, Malawi had the lowest GPA per capital with $350 and relatively low life expectancy at age 30.3. However, life expectancy does not have an absolute correlation to the income level. We can see Iceland had the highest life expectancy at age 42.85 but its GDP per capita was only $926.",
        title: "1800 - 1899",
      },
      x: width / 1.35,
      y: margin.top + 40,
    },
  ];

  const annotation_two = [
    {
      note: {
        label: "At the beginning of 20th century, Switzerland had the highest GDP per capita with $9640 and relatively high life expectancy at age 47.48. Malawi again had the lowest GPA per capital with $355 and remained a relatively  low life expectancy at age 30.3. However, the lowest GDP does not mean the lowest life expectancy. In the chart, we can see India had the lowest life expectancy at age 18.35. And we can see Norway had the highest life expectancy at age 53.47 but its GDP per capita was only $3643 which is far away from $9640 the highest recorded in the same year.",
        title: "1900 - 1999",
      },
      x: width / 1.25,
      y: margin.top + 40,
    },
  ];

  const annotation_three = [
    {
      note: {
        label: "Human’s average life expectancy had been greatly improved. The country with the shortest life expectancy was Eritrea with the average of 37.6 years, and the country with the longest life expectancy was Andorra with average of 83.7 years with only $31662 GPA per capital.Therefore, this tells us that countries with higher income level usually have longer life expectancy but the correlation is not absolute. Other factors like geopolitics like war or abnormal nature disaster or diet culture could play an equally important roles in affect a country’s average life expectancy. ",
        title: "2000 - 2014",
      },
      x: width / 1.25,
      y: margin.top + 40,
    },
  ];

  const annotate = (year) => {
    if (year >= 1800 && year <= 1899) {
      svg
        .append("g")
        .attr("class", "annotation-group")
        .call(d3.annotation().annotations(annotation_one));
    }

    if (year >= 1900 && year <= 1999) {
      svg
        .append("g")
        .attr("class", "annotation-group")
        .call(d3.annotation().annotations(annotation_two));
    }

    if (year >= 2000 && year <= 2014) {
      svg
        .append("g")
        .attr("class", "annotation-group")
        .call(d3.annotation().annotations(annotation_three));
    }
  };

  annotate(year);

  function updateChart(year) {
    formattedData = data
      .filter((d) => +d.year === year)
      .map((year) => {
        return {
          year: year.year,
          countries: year.countries.filter(
            (d) => d.income !== null && d.life_exp !== null
          ),
        };
      });

    selectedData = formattedData
      .map((year) => {
        return year.countries.map((country) => {
          return {
            country: country.country,
            income: country.income,
            life_exp: country.life_exp,
          };
        });
      })
      .flat();

    d3.select(".year-label").text(`${year}`);

    xScale.domain(d3.extent(selectedData, (d) => d.income));

    yScale.domain([0, d3.max(selectedData, (d) => d.life_exp)]);

    svg
      .select(".x-axis")
      .transition()
      .duration(300)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("fill", "#ccc");

    svg
      .select(".y-axis")
      .transition()
      .duration(300)
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("fill", "#ccc");

    d3.selectAll(".tick line").style("stroke", "#ccc");
    d3.selectAll(".domain").style("stroke", "#ccc");

    svg
      .selectAll("circle")
      .data(selectedData)
      .transition()
      .duration(300)
      .attr("cx", (d) => xScale(d.income))
      .attr("cy", (d) => yScale(d.life_exp));

    d3.selectAll(".annotation-group").remove();

    annotate(year);
  }

  d3.select("#years").on("input", function () {
    year = +d3.select(this).property("value");

    updateChart(year);
  });

  d3.select("#first").on("click", function () {
    d3.select("#years").property("value", 1800);
    updateChart(1800);
  });

  d3.select("#second").on("click", function () {
    d3.select("#years").property("value", 1900);
    updateChart(1900);
  });

  d3.select("#third").on("click", function () {
    d3.select("#years").property("value", 2000);
    updateChart(2000);
  });

  d3.select("#backward").on("click", function () {
    if (year >= 2001) {
      year = 2000;
    } else if (year >= 1901) {
      year = 1900;
    } else if (year >= 1801) {
      year = 1800;
    }
    d3.select("#years").property("value", year);
    updateChart(year);
  });

  d3.select("#forward").on("click", function () {
    if (year >= 1800 && year < 1900) {
      year = 1900;
    } else if (year >= 1900 && year < 2000) {
      year = 2000;
    } else if (year >= 2000) {
      year = 2014;
    }
    d3.select("#years").property("value", year);
    updateChart(year);
  });
};

drawChart();
