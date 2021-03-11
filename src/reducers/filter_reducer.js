import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions'
import products_reducer from './products_reducer';

const filter_reducer = (state, action) => {
  if(action.type===LOAD_PRODUCTS){
    let allPrices=action.payload.map((p)=>p.price);
    let maxPrice=Math.max(...allPrices)

    return {
      ...state,
      all_products:[...action.payload],
      filtered_products:[...action.payload],
      filters:{
        ...state.filters,
        max_price:maxPrice,
        price:maxPrice
      }
    }
  }

  if(action.type===SET_LISTVIEW)
    return {
      ...state,
      grid_view:false
    }
  if(action.type===SET_GRIDVIEW)
    return {
      ...state,
      grid_view:true
    }
  if(action.type===UPDATE_SORT)
    return {
      ...state,
      sort:action.payload
    }

  if(action.type===SORT_PRODUCTS){
    const {sort,filtered_products}=state;
    let tempProducts=[...filtered_products];
    if(sort==='price-lowest'){
      tempProducts=tempProducts.sort((a,b)=> a.price-b.price);
    }else if(sort==='price-highest'){
      tempProducts=tempProducts.sort((a,b)=> b.price-a.price);
    }else if(sort==='name-a'){
      tempProducts=tempProducts.sort((a,b)=> a.name.localeCompare(b.name))
    }else if(sort==='name-z'){
      tempProducts=tempProducts.sort((a,b)=> b.name.localeCompare(a.name))
    }

    return {...state,filtered_products:tempProducts}
  }

  if(action.type===UPDATE_FILTERS){
    const {name,value}=action.payload;
    return{
      ...state,
      filters:{
        ...state.filters,
        [name]:value
      }
    }
  }

  if(action.type===FILTER_PRODUCTS){
    const {all_products}=state;
    const {text,category,company,color,price,shipping}=state.filters;
    let tempProducts=[...all_products];
    //filtering
    if(text){
      tempProducts=tempProducts.filter((prod)=>{
        return prod.name.toLowerCase().startsWith(text)
      })
    }

    // category
    if(category!=='all'){
      tempProducts=tempProducts.filter(
        (product)=> product.category===category )
    }

    //company
    if(company!=='all'){
      tempProducts=tempProducts.filter(
        (product)=> product.company===company
      )
    }

    // colors
    if(color!='all'){
      tempProducts=tempProducts.filter((product)=>{
        return product.colors.find((c)=> c===color)
      })
    }

    //price
    tempProducts=tempProducts.filter((product)=>{
      return product.price<=price
    })

    // shipping
    if(shipping){
      tempProducts=tempProducts.filter((product)=>product.shipping===true)
    }

    return {...state,filtered_products:tempProducts}
  }

  if(action.type===CLEAR_FILTERS){
    return {
      ...state,
      filters:{
        text:"",
        company:"all",
        category:'all',
        color:'all',
        price:state.filters.max_price,
        shipping:false
      }
    }
  }
  throw new Error(`No Matching "${action.type}" - action type`)
}

export default filter_reducer
