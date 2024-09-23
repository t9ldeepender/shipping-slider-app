import { BlockStack, Box, Card, InlineGrid, Page, TextField, ColorPicker, Text, Grid, LegacyCard, Button} from "@shopify/polaris";
import { useState} from 'react';
import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import db from "../db.server"

//settings -> our model (made in prisma > migrations > 2nd folder > migration.sql)
export async function loader() {
  let settings = db.settings.findFirst()

  // if(!db){
  //   return false
  // }else{
  //   settings = db.settings.findFirst()
  //   try{
  //     if(!settings){
  //       console.log("No settings found");
  //       return json({ error: "No settings found" }, { status: 404 });
  //     }
    
  //     console.log("settings =>", settings)
      
  //   }catch(err){console.log(err, "no error found")}
  // }
  return json(settings)
}


export async function action({ request }){
  let settings = await request.formData()
  settings = Object.fromEntries(settings)
  console.log("******",settings)
  await db.settings.upsert({
    where: {
      id : "1"
    },
    update: {
      heading: settings.heading,
      headingColor: settings.heading_color,
      amount: parseInt(settings.amount),
      sliderColor: settings.slider_color,
    },
    create: {
      id : settings.id,
      heading: settings.heading,
      headingColor: settings.heading_color,
      amount: parseInt(settings.amount),
      sliderColor: settings.slider_color,
      shop: Math.random().toString()
    },
  })

  return json({message : settings})
}

export default function AppSettingsLayoutExample() {

  const settings = useLoaderData()

    const [color, setColor] = useState({
      hue: 120,
      brightness: 1,
      saturation: 1,
    });
    const [sliderColor, setSliderColor] = useState({
      hue: 120,
      brightness: 1,
      saturation: 1,
    });
    const [title, setTitle] = useState(settings)

    const [value, setValue] = useState(0);


    const handleChange = (newValue) => {
      if (/^\d*$/.test(newValue)) {
        setValue(newValue);
      }
    };

    // convert to hex color start
    function HSBtoHEX(hue, saturation, brightness) {
      const chroma = brightness * saturation;
      const huePrime = hue / 60;
      const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
    
      let r = 0, g = 0, b = 0;
    
      if (huePrime >= 0 && huePrime <= 1) {
        r = chroma;
        g = x;
      } else if (huePrime > 1 && huePrime <= 2) {
        r = x;
        g = chroma;
      } else if (huePrime > 2 && huePrime <= 3) {
        g = chroma;
        b = x;
      } else if (huePrime > 3 && huePrime <= 4) {
        g = x;
        b = chroma;
      } else if (huePrime > 4 && huePrime <= 5) {
        r = x;
        b = chroma;
      } else if (huePrime > 5 && huePrime <= 6) {
        r = chroma;
        b = x;
      }
    
      const m = brightness - chroma;
      r = Math.floor((r + m) * 255);
      g = Math.floor((g + m) * 255);
      b = Math.floor((b + m) * 255);

      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    }// convert to hex color end
    
    return (
      <Page
        divider
        title="App Configurations"
        primaryAction={{ content: "View on your store", disabled: true }}
        secondaryActions={[
          {
            content: "Duplicate",
            accessibilityLabel: "Secondary action label",
            onAction: () => alert("Duplicate action"),
          },
        ]}
      >
        
        <Form method="POST">
        <BlockStack gap={{ xs: "800", sm: "400" }}>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
              <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Heading 
              </Text>
              <TextField disabled label="ID" name="id" value={Math.random()} onChange={()=>Math.random()} />
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack>
                <TextField label="Title to be shown as heading on the cart" name="heading" value={title.dataType} onChange={(value)=>{setTitle({...title, dataType : value})}} />
              </BlockStack>
            </Card>
          </InlineGrid>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
              <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Select Heading Color</Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack>
              <Grid>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                  <LegacyCard sectioned>
                    <ColorPicker onChange={setColor} color={color} name="heading_color" />
                  </LegacyCard>
                </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                  <LegacyCard sectioned>
                  <TextField
                    label="Color code"
                    value={`${HSBtoHEX(color.hue, color.brightness, color.saturation)}`}
                    onChange={setColor}
                    type="text"
                    autoComplete="off"
                    name="heading_color"
                  />
                  </LegacyCard>
                </Grid.Cell>
              </Grid>

              </BlockStack>
            </Card>
          </InlineGrid>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
              <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Targetted Amount</Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack>
              <TextField
                label="Customer get free shipping on"
                value={parseInt(value)}
                onChange={handleChange}
                type="number"
                autoComplete="off"
                placeholder="Amount"
                name="amount"
              />
              </BlockStack>
            </Card>
          </InlineGrid>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">Shipping Slider Color</Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack>
              <Grid>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                  <LegacyCard sectioned>
                    <ColorPicker onChange={setSliderColor} color={sliderColor} name="slider_color" />
                  </LegacyCard>
                </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                  <LegacyCard sectioned>
                  <TextField
                    label="Color code"
                    value={`${HSBtoHEX(sliderColor.hue, sliderColor.brightness, sliderColor.saturation)}`}
                    onChange={setSliderColor}
                    type="text"
                    autoComplete="off"
                    name="slider_color"
                  />
                  </LegacyCard>
                </Grid.Cell>
              </Grid>
              </BlockStack>
            </Card>
          </InlineGrid>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
            </Box>
            <Button submit={true}>Submit</Button> 
          </InlineGrid>
        </BlockStack>
        </Form>
      </Page>
    )
  }