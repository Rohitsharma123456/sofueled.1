const base_url="http://localhost:3000";
const daysoptions=require("../models/daysoptions")
const runningquotas=require("../models/runningquotas")
const {getnewstartdate}=require("../utils/dateutils")
module.exports={
    renderFn:(req,res)=>{
        return res.render("fn.ejs",{
            base_url
        })
    },
    fetchoptions:(req,res)=>{
        const numofdays=parseInt(req.params.days)
        const options=daysoptions[numofdays]
        return res.json({options})
    },
    generatereport:(req,res)=>{
        const {startdate,daysoptions,comboselem}=req.body
        const combosArray=comboselem.split(" ").map((e)=>parseInt(e));
        const totalweeks=4
        const totaldays=totalweeks*7
        const maptotextualday={
            0:"Sunday",
            1:"Monday",
            2:"Tuesday",
            3:"Wednesday",
            4:"Thursday",
            5:"Friday",
            6:"Saturday"
        }
        // console.log("combosArray",combosArray)
        // const daytostarton="Monday"
        // const dayonstartdate=new Date(start_date).getDay();
        // generate dates for six months where start day is monday 
        let newstartday=getnewstartdate(startdate,combosArray)
        // console.log(newstartday)
        const alldates=[]
        let week=[]

        for(let i=0;i<totaldays;i++){
            let weeknumber=parseInt((i+1)/7)
            //totalquota and its distribution
           
            if((i+1)%7==0){
                let weekrunningquota=runningquotas?.filter(e=>e.week==weeknumber)[0];
                // console.log("weekrunningquota",weekrunningquota)
                // weekrunningquota=weekrunningquota[i+1/7]
                let exersiceobj=weekrunningquota?.exersicequatos?.filter(e=>e.days==parseInt(daysoptions))[0]
                // console.log("exersiceobj",exersiceobj)
                
            let totalquota=exersiceobj?.totalquota
                alldates.push({week:weeknumber,weekdates:week,totalquota})
                week.map((day,index)=>{
                    // console.log("exersiceobj.workouts[index].pert",exersiceobj.workouts[index].pert)
                    day.quota=totalquota*(exersiceobj.workouts[index].pert/100)
                    day.totalquota=totalquota
                })
                week=[]
            }
            
            let date=new Date(newstartday)
            let newdate=new Date(date.setDate(date.getDate()+i)).toISOString().split("T")[0]
            let newday=new Date(newdate).getDay();
          
                
            
            let day={

                newdate,
                newday:maptotextualday[newday],
                newweek:parseInt(weeknumber),
                
                
            }
            if(combosArray.includes(newday)){
                week.push(day)
            }
            
            
        }
        // console.log(alldates)
        return res.json({alldates})
    }
}