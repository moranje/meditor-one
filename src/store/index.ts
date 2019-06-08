import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'

// Models
import User from '@/store/models/User'
import Editor from '@/store/models/Editor'
import Folder from '@/store/models/Folder'
import File from '@/store/models/File'
import UI from '@/store/models/UI'

// Modules
import folders from '@/store/modules/folders'
import files from '@/store/modules/files'

Vue.use(Vuex)

// Create new instance of Database.
const database = new VuexORM.Database()

// Register Model and Module. The First argument is the Model, and
// second is the Module.
database.register(User)
database.register(Editor)
database.register(Folder, folders)
database.register(File, files)
database.register(UI)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
  plugins: [VuexORM.install(database)],
})

export default store
