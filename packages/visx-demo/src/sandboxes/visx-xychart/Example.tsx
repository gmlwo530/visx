import React from 'react';
import cityTemperature, { CityTemperature } from '@visx/mock-data/lib/mocks/cityTemperature';
import {
  AnimatedAxis,
  AnimatedGrid,
  DataProvider,
  BarSeries,
  BarStack,
  LineSeries,
  Tooltip,
  XYChart,
} from '@visx/xychart';
import ExampleControls from './ExampleControls';
import CustomChartBackground from './CustomChartBackground';

type Props = {
  width: number;
  height: number;
};

const xScaleConfig = { type: 'band', paddingInner: 0.3 } as const;
const yScaleConfig = { type: 'linear' } as const;
const numTicks = 4;
const data = cityTemperature.slice(200, 275);
const dataSmall = data.slice(25);
const getDate = (d: CityTemperature) => d.date;
const getSfTemperature = (d: CityTemperature) => Number(d['San Francisco']);
const getNyTemperature = (d: CityTemperature) => Number(d['New York']);
const getAustinTemperature = (d: CityTemperature) => Number(d.Austin);

export default function Example({ height }: Props) {
  return (
    <ExampleControls>
      {({
        animationTrajectory,
        renderBarSeries,
        renderBarStack,
        renderHorizontally,
        renderLineSeries,
        sharedTooltip,
        showGridColumns,
        showGridRows,
        showHorizontalCrosshair,
        showTooltip,
        showVerticalCrosshair,
        snapTooltipToDatumX,
        snapTooltipToDatumY,
        theme,
        xAxisOrientation,
        yAxisOrientation,
      }) => (
        <DataProvider
          theme={theme}
          xScale={renderHorizontally ? yScaleConfig : xScaleConfig}
          yScale={renderHorizontally ? xScaleConfig : yScaleConfig}
        >
          <XYChart height={Math.min(400, height)}>
            <CustomChartBackground />
            <AnimatedGrid
              key={`grid-${animationTrajectory}`} // force animate on update
              rows={showGridRows}
              columns={showGridColumns}
              animationTrajectory={animationTrajectory}
              numTicks={numTicks}
            />
            {renderBarSeries && (
              <BarSeries
                dataKey="New York"
                data={data}
                xAccessor={renderHorizontally ? getNyTemperature : getDate}
                yAccessor={renderHorizontally ? getDate : getNyTemperature}
                horizontal={renderHorizontally}
              />
            )}
            {renderBarStack && (
              <g fillOpacity={renderLineSeries ? 0.5 : 1}>
                <BarStack horizontal={renderHorizontally}>
                  <BarSeries
                    dataKey="New York"
                    data={dataSmall}
                    xAccessor={renderHorizontally ? getNyTemperature : getDate}
                    yAccessor={renderHorizontally ? getDate : getNyTemperature}
                  />
                  <BarSeries
                    dataKey="San Francisco"
                    data={dataSmall}
                    xAccessor={renderHorizontally ? getSfTemperature : getDate}
                    yAccessor={renderHorizontally ? getDate : getSfTemperature}
                  />
                  <BarSeries
                    dataKey="Austin"
                    data={dataSmall}
                    xAccessor={renderHorizontally ? getAustinTemperature : getDate}
                    yAccessor={renderHorizontally ? getDate : getAustinTemperature}
                  />
                </BarStack>
              </g>
            )}
            {renderLineSeries && (
              <>
                <LineSeries
                  dataKey="San Francisco"
                  data={renderBarStack ? dataSmall : data}
                  xAccessor={renderHorizontally ? getSfTemperature : getDate}
                  yAccessor={renderHorizontally ? getDate : getSfTemperature}
                  horizontal={!renderHorizontally}
                />
                <LineSeries
                  dataKey="Austin"
                  data={renderBarStack ? dataSmall : data}
                  xAccessor={renderHorizontally ? getAustinTemperature : getDate}
                  yAccessor={renderHorizontally ? getDate : getAustinTemperature}
                  horizontal={!renderHorizontally}
                />
              </>
            )}
            <AnimatedAxis
              key={`time-axis-${animationTrajectory}-${renderHorizontally}`}
              orientation={renderHorizontally ? yAxisOrientation : xAxisOrientation}
              numTicks={numTicks}
              animationTrajectory={animationTrajectory}
            />
            <AnimatedAxis
              key={`temp-axis-${animationTrajectory}-${renderHorizontally}`}
              label="Temperature (°F)"
              orientation={renderHorizontally ? xAxisOrientation : yAxisOrientation}
              numTicks={numTicks}
              animationTrajectory={animationTrajectory}
            />
            {showTooltip && (
              <Tooltip<CityTemperature>
                showHorizontalCrosshair={showHorizontalCrosshair}
                showVerticalCrosshair={showVerticalCrosshair}
                snapTooltipToDatumX={snapTooltipToDatumX}
                snapTooltipToDatumY={snapTooltipToDatumY}
                showDatumGlyph={snapTooltipToDatumX || snapTooltipToDatumY}
                showSeriesGlyphs={sharedTooltip}
                renderTooltip={({ tooltipData, colorScale }) => (
                  <>
                    {/** date */}
                    {tooltipData?.nearestDatum?.datum
                      ? getDate(tooltipData?.nearestDatum?.datum)
                      : 'No date'}
                    <br />
                    <br />
                    {/** temperatures */}
                    {((sharedTooltip
                      ? Object.keys(tooltipData?.datumByKey ?? {})
                      : [tooltipData?.nearestDatum?.key]
                    ).filter(key => key) as string[]).map(key => (
                      <div key={key}>
                        <em
                          style={{
                            color: colorScale?.(key),
                            textDecoration:
                              tooltipData?.nearestDatum?.key === key ? 'underline' : undefined,
                          }}
                        >
                          {key}
                        </em>{' '}
                        {tooltipData?.datumByKey[key].datum[key as keyof CityTemperature]}° F
                      </div>
                    ))}
                  </>
                )}
              />
            )}
          </XYChart>
        </DataProvider>
      )}
    </ExampleControls>
  );
}
