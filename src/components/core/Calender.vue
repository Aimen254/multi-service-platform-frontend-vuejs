<script setup>
import { onMounted, ref, inject, watch, computed, onBeforeUnmount } from 'vue';
import { Calendar } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import timegridPlugin from '@fullcalendar/timegrid';
import { useRoute } from 'vue-router';
const route = useRoute()
const myEvents = ref([])
const eventCalendar = ref(null)

let calendar = null

const props = defineProps({
    yourEvents: Array
})

const eventBus = inject('eventBus')

function selectedCalendars() {
    let selected = [],
        filterInputChecked = [].slice.call(document.querySelectorAll('.input-filter:checked'));

    filterInputChecked.forEach(item => {
        selected.push(item.getAttribute('data-value'));
    });

    return selected;
}

const iniailizeCalender = async () => {
    const views = ['events-calendar', 'admin-calendar'].includes(route.name) ? 'dayGridMonth,dayGridWeek,timeGridDay,listDay' : 'dayGridMonth,dayGridWeek'
    const calendarEl = document.getElementById('calendar'),
        appCalendarSidebar = document.querySelector('.app-calendar-sidebar'),
        addEventSidebar = document.getElementById('addEventSidebar'),
        appOverlay = document.querySelector('.app-overlay'),
        calendarsColor = {
            going: 'success',
            not_going: 'danger',
            maybe: 'warning',
            attend: 'info',
            not_attend: 'info'
        },
        offcanvasTitle = document.querySelector('.offcanvas-title'),
        btnToggleSidebar = document.querySelector('.btn-toggle-sidebar'),
        btnSubmit = document.querySelector('button[type="submit"]'),
        btnDeleteEvent = document.querySelector('.btn-delete-event'),
        btnCancel = document.querySelector('.btn-cancel'),
        eventTitle = document.querySelector('#eventTitle'),
        eventStartDate = document.querySelector('#eventStartDate'),
        eventEndDate = document.querySelector('#eventEndDate'),
        eventUrl = document.querySelector('#eventURL'),
        eventLabel = $('#eventLabel'), // ! Using jquery vars due to select2 jQuery dependency
        eventGuests = $('#eventGuests'), // ! Using jquery vars due to select2 jQuery dependency
        eventLocation = document.querySelector('#eventLocation'),
        eventDescription = document.querySelector('#eventDescription'),
        allDaySwitch = document.querySelector('.allDay-switch'),
        selectAll = document.querySelector('.select-all'),
        filterInput = [].slice.call(document.querySelectorAll('.input-filter')),
        inlineCalendar = document.querySelector('.inline-calendar');
    calendar = new Calendar(calendarEl, {
        initialView: 'dayGridWeek',
        // height: 500,
        events: myEvents.value,
        plugins: [dayGridPlugin, interactionPlugin, listPlugin, timegridPlugin],
        editable: false,
        dragScroll: false,
        dayMaxEvents: 2,
        eventResizableFromStart: true,
        customButtons: {
            sidebarToggle: {
                text: 'Sidebar'
            }
        },
        headerToolbar: {
            start: 'prev,next, title',
            end: views
        },
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: ''
        },
        direction: 'ltr',
        initialDate: new Date(),
        navLinks: false, // can click day/week names to navigate views
        eventClassNames: function ({ event: calendarEvent }) {
            // events color based on status
            const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar];
            // Background Color
            return ['fc-event-' + colorName];
        },
        dateClick: function (info) {
            let date = moment(info.date).format('YYYY-MM-DD');
            resetValues();
            bsAddEventSidebar.show();

            // For new event set offcanvas title text: Add Event
            if (offcanvasTitle) {
                offcanvasTitle.innerHTML = 'Add Event';
            }
            btnSubmit.innerHTML = 'Add';
            btnSubmit.classList.remove('btn-update-event');
            btnSubmit.classList.add('btn-add-event');
            btnDeleteEvent.classList.add('d-none');
            eventStartDate.value = date;
            eventEndDate.value = date;
        },
        eventClick: function (info) {
            eventClick(info);
        },

        datesSet: function (info) {
            let start = info?.start
            let end = info?.end
            start.setUTCMinutes(start.getUTCMinutes() - start.getTimezoneOffset());
            start = start.toISOString().split('T')[0]
            end = end.toISOString().split('T')[0]
            let viewName = 'week'
            switch (info?.view?.type) {
                case 'dayGridMonth':
                    viewName = 'month'
                    break;
                case 'timeGridDay':
                    viewName = 'day'
                    break
                case 'listDay':
                    viewName = 'list'
                    break;
            }
            eventBus.emit('calendar-view-name', {
                view: viewName,
                start: start,
                end: end,
                elementRef: eventCalendar.value
            })
        },
        // viewDidMount: function () {
        //     modifyToggler();
        // }
    });

    // Render calendar
    calendar.render();
}

watch(() => props.yourEvents, (newEvents) => {
    let events = newEvents
    if (calendar) {
        calendar.removeAllEvents(); // Remove existing events
        calendar.addEventSource(events); // Add new events
    }
})

onMounted(async () => {
    myEvents.value = props.yourEvents
    await iniailizeCalender()

    eventBus.on('bookmarked-events', async () => {
        if (calendar) {
            calendar.changeView('dayGridWeek');
        }
    })
})

onBeforeUnmount(() => {
    eventBus.off('bookmarked-events')
});

</script>

<template>
    <div class="card app-calendar-wrapper" ref="eventCalendar">
        <div class="row g-0">
            <!-- Calendar & Modal -->
            <div class="col app-calendar-content">
                <div class="card shadow-none border-0">
                    <div class="card-body pb-0">
                        <!-- FullCalendar -->
                        <div id="calendar"></div>
                    </div>
                </div>
            </div>
            <!-- /Calendar & Modal -->
        </div>
    </div>
</template>

<style></style>